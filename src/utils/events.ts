import { type EventFromServer, type Option } from "../type.ts";
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";
import { frequency, reminderTime, repeatLimits } from "./miscs.ts";

const FREQUENCY_OPTIONS: Record<string, unknown> = {
    none: undefined,
    everyday: { freq: RRule.DAILY },
    everyweek: { freq: RRule.WEEKLY },
    "every-two-weeks": { freq: RRule.WEEKLY, interval: 2 },
    "every-month": { freq: RRule.MONTHLY },
    "every-year": { freq: RRule.YEARLY },
};

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
    option?: { numOccurrence?: number; untilDate?: Date },
): string => {
    if (!startDate || isNaN(startDate.getTime())) return "";

    const opts = FREQUENCY_OPTIONS[frequency];
    if (!opts) return "";

    const floatingStartDate = datetime(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds(),
    );

    const floatingUntilDate = option?.untilDate
        ? datetime(
              option.untilDate.getFullYear(),
              option.untilDate.getMonth() + 1,
              option.untilDate.getDate(),
              option.untilDate.getHours(),
              option.untilDate.getMinutes(),
              option.untilDate.getSeconds(),
          )
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
};

export const excludeADateFromRrule = (rruleString: string, date: Date) => {
    const rule = rrulestr(rruleString, {
        cache: true,
    });

    const floatingDate = datetime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    );

    const ruleSet = new RRuleSet();
    ruleSet.rrule(rule);
    ruleSet.exdate(floatingDate);

    return ruleSet.toString();
};

export const setEndDateForRrule = (rruleString: string, date: Date) => {
    const parsed = rrulestr(rruleString, {
        cache: true,
    });

    const floatingDate = datetime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    );

    const newRuleSet = new RRuleSet();

    if (parsed instanceof RRuleSet) {
        parsed.rrules().forEach((rule) => {
            newRuleSet.rrule(
                new RRule({ ...rule.options, until: floatingDate }),
            );
        });

        parsed.exdates().forEach((exdate) => {
            newRuleSet.exdate(exdate);
        });

        parsed.rdates().forEach((rdate) => newRuleSet.rdate(rdate));
        parsed.exrules().forEach((exrule) => newRuleSet.exrule(exrule));
    } else {
        newRuleSet.rrule(new RRule({ ...parsed.options, until: floatingDate }));
    }

    return newRuleSet.toString();
};

export const getReminderOptionsFromKeys = (
    keys: string[] | undefined,
): (Option | null)[] => {
    return keys
        ? keys.map((key) => {
              const foundOption = reminderTime.find((opt) => opt.key === key);
              return foundOption || null;
          })
        : [];
};

export const getRecurrenceOptionFromRRule = (
    rruleString: string | null | undefined,
): {
    freq: Option;
    repeatLimit: Option;
    numOccurrence?: number;
    untilDate?: Date;
} => {
    let detectedKey = "none";

    if (rruleString) {
        try {
            const parsed = rrulestr(rruleString);

            let options;
            if (parsed instanceof RRuleSet) {
                const rrules = parsed.rrules();
                if (rrules.length === 0) {
                    throw new Error("No RRULE found in RRuleSet");
                }
                options = rrules[0].options;
            } else {
                options = parsed.options;
            }

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
                // See explanation in expandEvent function in events.ts for why we need to subtract 7 hours here
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
            };
        } catch (e) {
            console.error("RRule parse error", e);
        }
    }
    return {
        freq: frequency[0],
        repeatLimit: repeatLimits[0],
    };
};
