import { useMemo } from "react";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { useAppDispatch, useAppSelector } from "../hook";
import { setShowAddEventDialog } from "../reducers/uiReducer";
import monthNames from "../utils/monthNames";
import { LunarCalendar } from "@dqcai/vn-lunar";
import findAllEventsInADay from "../utils/findAllEventsInADay.ts";
import formatDateTime from "../utils/formatDatetime.ts";

const Sidebar = () => {
    const accessToken = useAppSelector((state) => state.user.accessToken);
    const selectedTs = useAppSelector(
        (state) => state.date.currentSelectedSolarDate,
    );

    const currentSelectedSolarDate = useMemo(
        () => new Date(selectedTs),
        [selectedTs],
    );
    const events = useAppSelector((state) => state.events);

    const eventsInCurrentDay = useMemo(() => {
        if (!accessToken) {
            return [];
        } else {
            return findAllEventsInADay(events, currentSelectedSolarDate).sort(
                (e1, e2) => {
                    if (e1.isAllDay && !e2.isAllDay) return 1;
                    if (!e1.isAllDay && e2.isAllDay) return -1;
                    return Number(e1.startDateTime) - Number(e2.startDateTime);
                },
            );
        }
    }, [currentSelectedSolarDate, events, accessToken]);

    const selectedLunarDate = useMemo(() => {
        const d = currentSelectedSolarDate;
        if (Number.isNaN(d.getTime())) {
            return null;
        }
        try {
            return LunarCalendar.fromSolar(
                d.getDate(),
                d.getMonth() + 1,
                d.getFullYear(),
            );
        } catch {
            return null;
        }
    }, [currentSelectedSolarDate]);

    const dispatch = useAppDispatch();

    const day = currentSelectedSolarDate.getDate();
    const month = monthNames[currentSelectedSolarDate.getMonth()] ?? "";
    const year = currentSelectedSolarDate.getFullYear();

    const lunarDay = selectedLunarDate?.lunarDate?.day ?? "";
    const lunarMonth = selectedLunarDate?.lunarDate?.month ?? "";
    const lunarLeap = selectedLunarDate?.lunarDate?.leap ? " (nhuận)" : "";
    const lunarYearCanChi = selectedLunarDate?.yearCanChi ?? "";

    return (
        <div className='h-screen grid grid-rows-[1fr_10fr] gap-2 p-2 bg-gray-150 dark:bg-gray-900 dark:text-white'>
            <div>
                <p className='text-9xl font-bold text-center text-orange-600'>
                    {day}
                </p>
                <p className='text-center font-bold text-3xl'>{month}</p>
                <p className='text-center font-bold text-3xl'>{year}</p>
                <p className='text-center font-bold text-xl mt-1'>
                    {lunarDay} tháng {lunarMonth}
                    {lunarLeap}, {lunarYearCanChi}
                </p>

                {accessToken && (
                    <div className='flex justify-center mt-4'>
                        <button
                            onClick={() =>
                                dispatch(setShowAddEventDialog(true))
                            }
                            aria-label='Add'
                            className='px-4 py-2 rounded-md text-white bg-orange-600 hover:cursor-pointer hover:bg-orange-700 active:bg-orange-800 font-bold text-lg'>
                            <Icon
                                path={mdiPlus}
                                size={1}
                                className='inline pb-1'
                            />{" "}
                            Thêm
                        </button>
                    </div>
                )}
            </div>
            <div className='px-2'>
                <p className='font-bold text-lg'>Sự kiện</p>
                {eventsInCurrentDay.length > 0 ? (
                    eventsInCurrentDay.map((e) => {
                        const start = new Date(Number(e.startDateTime));
                        const end = new Date(Number(e.endDateTime));
                        const label = e.isAllDay
                            ? `${e.title}\n${start.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                              })}`
                            : `${e.title}\n${formatDateTime(start)} - ${formatDateTime(end)}`;
                        return (
                            <div
                                aria-label={e.title}
                                title={label}
                                id={e.id}
                                className='mt-2 grid grid-cols-[3fr_1fr]'>
                                <p className='truncate max-w-48'>{e.title}</p>
                                {e.isAllDay ? (
                                    <p>Cả ngày</p>
                                ) : (
                                    <p>
                                        {start.toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                    </p>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className='mt-2'>
                        <em>Không có sự kiện</em>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
