import { RRule } from "rrule";
import { jwtDecode } from "jwt-decode";
import type { AccessTokenPayload, Option } from "../type.ts";

export const decodeAccessToken = (token: string) => {
    return jwtDecode(token) as AccessTokenPayload;
};

export const formatDateTime = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

export const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

export const monthNames = [
    "Tháng một",
    "Tháng hai",
    "Tháng ba",
    "Tháng tư",
    "Tháng năm",
    "Tháng sáu",
    "Tháng bảy",
    "Tháng tám",
    "Tháng chín",
    "Tháng mười",
    "Tháng mười một",
    "Tháng mười hai",
];

export const reminderTime: Option[] = [
    { key: "5-min", value: "Trước 5 phút" },
    { key: "10-min", value: "Trước 10 phút" },
    { key: "15-min", value: "Trước 15 phút" },
    { key: "30-min", value: "Trước 30 phút" },
    { key: "1-hour", value: "Trước 1 giờ" },
    { key: "2-hour", value: "Trước 2 giờ" },
    { key: "6-hour", value: "Trước 6 giờ" },
    { key: "12-hour", value: "Trước 12 giờ" },
    { key: "1-day", value: "Trước 1 ngày" },
    { key: "2-day", value: "Trước 2 ngày" },
    { key: "3-day", value: "Trước 3 ngày" },
    { key: "1-week", value: "Trước 1 tuần" },
    { key: "2-week", value: "Trước 2 tuần" },
    { key: "1-month", value: "Trước 1 tháng" },
];

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

export const timesToPick = () => {
    const res: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (const minute of [0, 15, 30, 45]) {
            res.push(
                `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
            );
        }
    }
    return res;
};

export const frequency: Option[] = [
    { key: "none", value: "Không" },
    { key: "everyday", value: "Hàng ngày" },
    { key: "everyweek", value: "Hàng tuần" },
    { key: "every-two-weeks", value: "Mỗi hai tuần" },
    { key: "every-month", value: "Hàng tháng" },
    { key: "every-year", value: "Hàng năm" },
];

export const getFrequencyOptionFromRRule = (
    rruleString: string | null | undefined,
): Option => {
    let detectedKey = "none";

    if (rruleString) {
        try {
            const options = RRule.parseString(rruleString);
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
        } catch (e) {
            console.error("RRule parse error", e);
        }
    }
    const foundOption = frequency.find((f) => f.key === detectedKey);

    return foundOption || frequency[0];
};

export const deleteOptions: Option[] = [
    { key: "all", value: "Tất cả sự kiện" },
    {
        key: "subsequent",
        value: "Sự kiện này và các sự kiện tiếp theo",
    },
    { key: "current", value: "Chỉ sự kiện này" },
    { key: "cancel", value: "Hủy" },
];
