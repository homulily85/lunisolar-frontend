import { RRule } from "rrule";

const FREQUENCY_OPTIONS: Record<string, unknown> = {
    none: undefined,
    everyday: { freq: RRule.DAILY },
    everyweek: { freq: RRule.WEEKLY },
    "every-two-weeks": { freq: RRule.WEEKLY, interval: 2 },
    "every-month": { freq: RRule.MONTHLY },
    "every-year": { freq: RRule.YEARLY },
};

const createRruleString = (frequency: string, startDate: Date): string => {
    if (!startDate || isNaN(startDate.getTime())) return "";

    const opts = FREQUENCY_OPTIONS[frequency];
    if (!opts) return "";

    const rule = new RRule({ ...opts, dtstart: startDate });
    return rule.toString();
};

export default createRruleString;
