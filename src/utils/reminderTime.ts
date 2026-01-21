import type { Option } from "../type.ts";

const reminderTime: Option[] = [
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

export default reminderTime;
