import { useCallback, useMemo } from "react";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { useAppDispatch, useAppSelector } from "../hook.ts";
import monthNames from "../utils/monthNames.ts";
import { setCurrentSelectedSolarDate } from "../reducers/dateReducer.ts";

const ICON_SIZE = 1.25;

const NavBar = () => {
    const selectedTs = useAppSelector((s) => s.date.currentSelectedSolarDate);
    const todayTs = useAppSelector((s) => s.date.today);
    const dispatch = useAppDispatch();

    const selectedDate = useMemo(() => new Date(selectedTs), [selectedTs]);

    const label = useMemo(
        () =>
            `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`,
        [selectedDate],
    );

    const changeMonth = useCallback(
        (delta: number) => {
            const d = new Date(selectedTs);
            d.setMonth(d.getMonth() + delta);
            dispatch(setCurrentSelectedSolarDate(d.getTime()));
        },
        [dispatch, selectedTs],
    );

    const jumpToToday = useCallback(() => {
        dispatch(setCurrentSelectedSolarDate(todayTs));
    }, [dispatch, todayTs]);

    const btnBase =
        "hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-800 rounded-full p-2 flex items-center justify-center";

    return (
        <div className='p-4 flex justify-between dark:bg-gray-800 dark:text-white'>
            <div className='flex justify-center items-center gap-2'>
                <button
                    aria-label='Previous month'
                    className={btnBase}
                    onClick={() => changeMonth(-1)}>
                    <Icon path={mdiChevronLeft} size={ICON_SIZE} />
                </button>

                <p className='text-2xl font-bold w-70 text-center'>{label}</p>

                <button
                    aria-label='Next month'
                    className={btnBase}
                    onClick={() => changeMonth(1)}>
                    <Icon path={mdiChevronRight} size={ICON_SIZE} />
                </button>

                <button
                    onClick={jumpToToday}
                    className='hover:bg-gray-200 active:bg-gray-300 rounded-xl border py-2 px-8 border-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-800'
                    aria-label='Jump to today'>
                    Hôm nay
                </button>
            </div>
            <div className='flex justify-center items-center gap-2'>
                <button className='hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-800 rounded-lg py-2 px-2'></button>
            </div>
        </div>
    );
};

export default NavBar;
