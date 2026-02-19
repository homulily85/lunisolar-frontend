import { type EventFromServer, type Option } from "../type.ts";
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";
import { frequency, reminderTime, repeatLimits } from "./miscs.ts";
import { LunarCalendar } from "@dqcai/vn-lunar";

const FREQUENCY_OPTIONS: Record<string, unknown> = {
    none: undefined,
    everyday: { freq: RRule.DAILY },
    everyweek: { freq: RRule.WEEKLY },
    "every-two-weeks": { freq: RRule.WEEKLY, interval: 2 },
    "every-month": { freq: RRule.MONTHLY },
    "every-year": { freq: RRule.YEARLY },
};

const toFloatingDate = (d: Date) =>
    datetime(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
    );

const makeFloatingFromSolar = (
    solar: { year: number; month: number; day: number } | undefined,
    startDate: Date,
) =>
    solar
        ? datetime(
              solar.year,
              solar.month,
              solar.day,
              startDate.getHours(),
              startDate.getMinutes(),
              startDate.getSeconds(),
          )
        : undefined;

export const isThisEventFinishedAfter = (
    event: EventFromServer,
    datetime: Date,
) => {
    return event.endDateTime > datetime.getTime();
};

export const isThisEventFinishedBefore = (
    event: EventFromServer,
    datetime: Date,
) => {
    return event.endDateTime < datetime.getTime();
};

export const isThisEventStartBefore = (
    event: EventFromServer,
    datetime: Date,
) => {
    return event.startDateTime < datetime.getTime();
};

export const isThisEventStartInTimeRange = (
    event: EventFromServer,
    rangeStart: Date,
    rangeEnd: Date,
) => {
    return (
        event.startDateTime >= rangeStart.getTime() &&
        event.startDateTime <= rangeEnd.getTime()
    );
};

export const expandEvent = (
    event: EventFromServer,
    startRange: Date,
    endRange: Date,
) => {
    if (!event.rruleString) {
        return [event];
    } else {
        const expandedEvents: EventFromServer[] = [];

        const duration = event.endDateTime - event.startDateTime;

        const rule = rrulestr(event.rruleString, {
            cache: true,
        });

        const dates = rule.between(startRange, endRange, true);
        const instances = dates.map((date) => {
            const instance = { ...event };
            // Even though the given offset is `Z` (UTC), these are local times, not UTC times.
            // JS Date will parse them as UTC, so we need to subtract 7 hours to get the correct local time.
            date.setHours(date.getHours() - 7);
            instance.startDateTime = date.getTime();
            instance.endDateTime = new Date(
                date.getTime() + duration,
            ).getTime();

            instance.id = `${instance.id}_${date.getTime()}`;

            return instance;
        });

        expandedEvents.push(...instances);
        expandedEvents.push(event);
        return expandedEvents;
    }
};

export const createRruleString = (
    frequency: string,
    startDate: Date,
    option?: {
        numOccurrence?: number;
        untilDate?: Date;
        repeatByLunar?: boolean;
    },
): string => {
    if (!startDate || isNaN(startDate.getTime())) return "";

    if (!option?.repeatByLunar) {
        const opts = FREQUENCY_OPTIONS[frequency];
        if (!opts) return "";

        const floatingStartDate = toFloatingDate(startDate);

        const floatingUntilDate = option?.untilDate
            ? toFloatingDate(option.untilDate)
            : undefined;

        const rule = new RRule({
            ...opts,
            dtstart: floatingStartDate,
            count: option?.numOccurrence,
            until: floatingUntilDate,
        });

        const ruleSet = new RRuleSet();
        ruleSet.rrule(rule);

        return ruleSet.toString();
    } else {
        const lunarStartDate = LunarCalendar.fromSolar(
            startDate.getDate(),
            startDate.getMonth() + 1,
            startDate.getFullYear(),
        );

        const floatingStartDate = toFloatingDate(startDate);

        const ruleSet = new RRuleSet();
        ruleSet.rdate(floatingStartDate);

        if (frequency === "every-year") {
            if (option?.numOccurrence) {
                for (let i = 0; i < option.numOccurrence - 1; i++) {
                    const nextLunarDate = LunarCalendar.fromLunar(
                        lunarStartDate.lunarDate.day,
                        lunarStartDate.lunarDate.month,
                        lunarStartDate.lunarDate.year + i + 1,
                    );

                    const nextSolarDate = nextLunarDate.solarDate;
                    const floatingNextSolarDate = makeFloatingFromSolar(
                        nextSolarDate,
                        startDate,
                    );
                    if (!floatingNextSolarDate) continue;

                    ruleSet.rdate(floatingNextSolarDate);
                }
            } else if (option?.untilDate) {
                let nextYear = lunarStartDate.lunarDate.year + 1;
                while (true) {
                    const nextLunarDate = LunarCalendar.fromLunar(
                        lunarStartDate.lunarDate.day,
                        lunarStartDate.lunarDate.month,
                        nextYear,
                    );

                    const nextSolarDate = nextLunarDate.solarDate;
                    const floatingNextSolarDate = makeFloatingFromSolar(
                        nextSolarDate,
                        startDate,
                    );
                    if (!floatingNextSolarDate) continue;

                    if (floatingNextSolarDate > option.untilDate) break;
                    ruleSet.rdate(floatingNextSolarDate);
                    nextYear++;
                }
            } else {
                const defaultNumOccurrence = 100;
                for (let i = 0; i < defaultNumOccurrence - 1; i++) {
                    const nextLunarDate = LunarCalendar.fromLunar(
                        lunarStartDate.lunarDate.day,
                        lunarStartDate.lunarDate.month,
                        lunarStartDate.lunarDate.year + i + 1,
                    );

                    const nextSolarDate = nextLunarDate.solarDate;
                    const floatingNextSolarDate = makeFloatingFromSolar(
                        nextSolarDate,
                        startDate,
                    );
                    if (!floatingNextSolarDate) continue;
                    ruleSet.rdate(floatingNextSolarDate);
                }
            }
        } else if (frequency === "every-month") {
            if (option?.numOccurrence) {
                for (let i = 0; i < option.numOccurrence - 1; i++) {
                    const totalMonths = lunarStartDate.lunarDate.month + i + 1;
                    const targetYear =
                        lunarStartDate.lunarDate.year +
                        Math.floor((totalMonths - 1) / 12);
                    const targetMonth = ((totalMonths - 1) % 12) + 1;

                    const nextLunarDate = LunarCalendar.fromLunar(
                        lunarStartDate.lunarDate.day,
                        targetMonth,
                        targetYear,
                    );

                    const nextSolarDate = nextLunarDate.solarDate;
                    const floatingNextSolarDate = makeFloatingFromSolar(
                        nextSolarDate,
                        startDate,
                    );
                    if (!floatingNextSolarDate) continue;
                    ruleSet.rdate(floatingNextSolarDate);
                }
            } else if (option?.untilDate) {
                let monthOffset = 1;
                while (true) {
                    const totalMonths =
                        lunarStartDate.lunarDate.month + monthOffset;
                    const targetYear =
                        lunarStartDate.lunarDate.year +
                        Math.floor((totalMonths - 1) / 12);
                    const targetMonth = ((totalMonths - 1) % 12) + 1;

                    const nextLunarDate = LunarCalendar.fromLunar(
                        lunarStartDate.lunarDate.day,
                        targetMonth,
                        targetYear,
                    );

                    const nextSolarDate = nextLunarDate.solarDate;

                    const floatingNextSolarDate = makeFloatingFromSolar(
                        nextSolarDate,
                        startDate,
                    );
                    monthOffset++;
                    if (!floatingNextSolarDate) continue;

                    if (floatingNextSolarDate > option.untilDate) {
                        break;
                    }

                    ruleSet.rdate(floatingNextSolarDate);
                }
            } else {
                const defaultNumOccurrence = 1200; // 100 years of monthly occurrences
                for (let i = 0; i < defaultNumOccurrence - 1; i++) {
                    const totalMonths = lunarStartDate.lunarDate.month + i + 1;
                    const targetYear =
                        lunarStartDate.lunarDate.year +
                        Math.floor((totalMonths - 1) / 12);
                    const targetMonth = ((totalMonths - 1) % 12) + 1;

                    const nextLunarDate = LunarCalendar.fromLunar(
                        lunarStartDate.lunarDate.day,
                        targetMonth,
                        targetYear,
                    );

                    const nextSolarDate = nextLunarDate.solarDate;
                    const floatingNextSolarDate = makeFloatingFromSolar(
                        nextSolarDate,
                        startDate,
                    );
                    if (!floatingNextSolarDate) continue;
                    ruleSet.rdate(floatingNextSolarDate);
                }
            }
        }
        return ruleSet.toString();
    }
};

export const excludeADateFromRrule = (rruleString: string, date: Date) => {
    const rule = rrulestr(rruleString, { cache: true });
    const floatingDate = toFloatingDate(date);

    const ruleSet = new RRuleSet();
    ruleSet.rrule(rule);
    ruleSet.exdate(floatingDate);

    return ruleSet.toString();
};

export const setEndDateForRrule = (rruleString: string, date: Date) => {
    const parsed = rrulestr(rruleString, { cache: true });
    const floatingDate = toFloatingDate(date);
    const cutoffTime = floatingDate.getTime();

    const newRuleSet = new RRuleSet();

    if (parsed instanceof RRuleSet) {
        parsed.rrules().forEach((rule) => {
            newRuleSet.rrule(
                new RRule({ ...rule.options, until: floatingDate }),
            );
        });

        parsed.exdates().forEach((exdate) => {
            if (exdate.getTime() <= cutoffTime) {
                newRuleSet.exdate(exdate);
            }
        });

        parsed.rdates().forEach((rdate) => {
            if (rdate.getTime() < cutoffTime) {
                newRuleSet.rdate(rdate);
            }
        });

        parsed.exrules().forEach((exrule) => newRuleSet.exrule(exrule));
    } else {
        newRuleSet.rrule(new RRule({ ...parsed.options, until: floatingDate }));
    }

    return newRuleSet.toString();
};

export const getReminderOptionsFromKeys = (
    keys: string[] | undefined,
): (Option | null)[] => {
    return (
        keys?.map(
            (key) => reminderTime.find((opt) => opt.key === key) || null,
        ) ?? []
    );
};

export const getRecurrenceOptionFromRRule = (
    rruleString: string | null | undefined,
): {
    freq: Option;
    repeatLimit: Option;
    numOccurrence?: number;
    untilDate?: Date;
    repeatByLunar?: boolean;
} => {
    if (rruleString) {
        try {
            const parsed = rrulestr(rruleString, { cache: true });

            if (parsed instanceof RRuleSet) {
                const rrules = parsed.rrules();
                const rdates = parsed.rdates();

                if (rrules.length === 0 && rdates.length > 0) {
                    const numOccurrence = rdates.length;
                    let detectedKey = "every-month"; // Default to monthly

                    if (rdates.length > 1) {
                        const diffTime =
                            rdates[1].getTime() - rdates[0].getTime();
                        const diffDays = Math.abs(
                            diffTime / (1000 * 60 * 60 * 24),
                        );

                        // A lunar month is ~29.5 days, a lunar year is ~354 to 384 days.
                        // A threshold of 60 days safely separates the two.
                        if (diffDays > 60) {
                            detectedKey = "every-year";
                        }
                    }

                    const repeatLimitKey =
                        numOccurrence > 50 ? "none" : "numOccurrence";

                    return {
                        freq:
                            frequency.find((f) => f.key === detectedKey) ||
                            frequency[0],
                        repeatLimit:
                            repeatLimits.find(
                                (opt) => opt.key === repeatLimitKey,
                            ) || repeatLimits[0],
                        numOccurrence,
                        untilDate: undefined,
                        repeatByLunar: true,
                    };
                }
            }

            let options;
            if (parsed instanceof RRuleSet) {
                const rrules = parsed.rrules();
                if (rrules.length === 0) {
                    throw new Error("No RRULE or RDATE found in RRuleSet");
                }
                options = rrules[0].options;
            } else {
                options = parsed.options;
            }

            let detectedKey = "none";
            const freq = options.freq;
            const interval = options.interval || 1;

            if (freq === RRule.DAILY && interval === 1)
                detectedKey = "everyday";
            else if (freq === RRule.WEEKLY && interval === 1)
                detectedKey = "everyweek";
            else if (freq === RRule.WEEKLY && interval === 2)
                detectedKey = "every-two-weeks";
            else if (freq === RRule.MONTHLY && interval === 1)
                detectedKey = "every-month";
            else if (freq === RRule.YEARLY && interval === 1)
                detectedKey = "every-year";

            const until = options.until ? new Date(options.until) : undefined;
            if (until) {
                // Subtract 7 hours to normalize timezone
                until.setHours(until.getHours() - 7);
            }

            const count = options.count || undefined;

            return {
                freq:
                    frequency.find((f) => f.key === detectedKey) ||
                    frequency[0],
                repeatLimit: until
                    ? repeatLimits.find((opt) => opt.key === "untilDate")!
                    : count
                      ? repeatLimits.find((opt) => opt.key === "numOccurrence")!
                      : repeatLimits[0],
                untilDate: until,
                numOccurrence: count,
                repeatByLunar: false,
            };
        } catch (e) {
            console.error("RRule parse error", e);
        }
    }

    return {
        freq: frequency[0],
        repeatLimit: repeatLimits[0],
        repeatByLunar: false,
    };
};
