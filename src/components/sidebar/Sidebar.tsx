import { useMemo } from "react";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { useAppDispatch, useAppSelector } from "../../hook.ts";
import { setShowAddEventDialog } from "../../reducers/uiReducer.ts";
import { LunarCalendar } from "@dqcai/vn-lunar";
import EventToday from "./EventToday.tsx";
import EventOtherDay from "./EventOtherDay.tsx";
import { isSameDate, monthNames } from "../../utils/misc.ts";

const Sidebar = () => {
    const accessToken = useAppSelector((state) => state.user.accessToken);
    const selectedTs = useAppSelector(
        (state) => state.date.currentSelectedSolarDate,
    );

    const currentSelectedSolarDate = useMemo(
        () => new Date(selectedTs),
        [selectedTs],
    );

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
            <div className='px-2 w-full'>
                <p className='font-bold text-lg'>Sự kiện</p>
                {accessToken &&
                isSameDate(new Date(), currentSelectedSolarDate) ? (
                    <EventToday />
                ) : (
                    <EventOtherDay date={currentSelectedSolarDate} />
                )}
            </div>
        </div>
    );
};

export default Sidebar;
