import { type EventFromServer } from "../type.ts";
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";

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
    ruleSet.rrule(new RRule({ ...rule.options, until: floatingDate }));

    return ruleSet.toString();
};
