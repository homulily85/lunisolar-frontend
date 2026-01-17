import { z } from "zod";

export interface DayInfo {
    date: Date;
    ts: number;
    key: string;
    lunarText: string;
    isToday: boolean;
    isSelected: boolean;
    isCurrentMonth: boolean;
}

export const EventSchema = z.object({
    title: z.string(),
    place: z.string().optional(),
    isAllDay: z.boolean(),
    startDateTime: z.iso.datetime(),
    endDateTime: z.iso.datetime(),
    rruleString: z.string(),
    description: z.string(),
    reminder: z.array(z.string()).optional(),
});

export type Event = z.infer<typeof EventSchema>;
