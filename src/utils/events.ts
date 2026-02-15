import { type EventFromServer } from "../type.ts";
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";
import { toZonedTime } from "date-fns-tz";

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
    option?: { timezone?: string; numOccurrence?: number; untilDate?: Date },
): string => {
    const timezone = option?.timezone || "Asia/Ho_Chi_Minh";

    if (!startDate || isNaN(startDate.getTime())) return "";

    const opts = FREQUENCY_OPTIONS[frequency];
    if (!opts) return "";

    const zonedStartDate = toZonedTime(startDate, timezone);

    const floatingStartDate = datetime(
        zonedStartDate.getFullYear(),
        zonedStartDate.getMonth() + 1,
        zonedStartDate.getDate(),
        zonedStartDate.getHours(),
        zonedStartDate.getMinutes(),
        zonedStartDate.getSeconds(),
    );

    const zonedUntilDate = option?.untilDate
        ? toZonedTime(option.untilDate, timezone)
        : undefined;

    const floatingUntilDate = zonedUntilDate
        ? datetime(
              zonedUntilDate.getFullYear(),
              zonedUntilDate.getMonth() + 1,
              zonedUntilDate.getDate(),
              zonedUntilDate.getHours(),
              zonedUntilDate.getMinutes(),
              zonedUntilDate.getSeconds(),
          )
        : undefined;

    const rule = new RRule({
        ...opts,
        dtstart: floatingStartDate,
        tzid: timezone,
        count: option?.numOccurrence,
        until: floatingUntilDate,
    });

    const ruleSet = new RRuleSet();
    ruleSet.rrule(rule);

    return ruleSet.toString();
};

export const excludeADateFromRrule = (
    rruleString: string,
    date: Date,
    timezone: string = "Asia/Ho_Chi_Minh",
) => {
    const rule = rrulestr(rruleString, {
        cache: true,
    });

    const zonedDate = toZonedTime(date, timezone);

    const floatingDate = datetime(
        zonedDate.getFullYear(),
        zonedDate.getMonth() + 1,
        zonedDate.getDate(),
        zonedDate.getHours(),
        zonedDate.getMinutes(),
        zonedDate.getSeconds(),
    );

    const ruleSet = new RRuleSet();
    ruleSet.rrule(rule);
    ruleSet.exdate(floatingDate);

    return ruleSet.toString();
};

export const setEndDateForRrule = (
    rruleString: string,
    date: Date,
    timezone: string = "Asia/Ho_Chi_Minh",
) => {
    const rule = rrulestr(rruleString, {
        cache: true,
    });

    const zonedDate = toZonedTime(date, timezone);

    const floatingDate = datetime(
        zonedDate.getFullYear(),
        zonedDate.getMonth() + 1,
        zonedDate.getDate(),
        zonedDate.getHours(),
        zonedDate.getMinutes(),
        zonedDate.getSeconds(),
    );

    const ruleSet = new RRuleSet();
    ruleSet.rrule(new RRule({ ...rule.options, until: floatingDate }));

    return ruleSet.toString();
};
