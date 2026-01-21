import { z } from "zod";
import type { JwtPayload } from "jwt-decode";

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

export interface AccessTokenPayload extends JwtPayload {
    id: string;
    name: string;
    profilePictureLink: string;
}

export type Option = { key: string; value: string };
