import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { useAppDispatch, useAppSelector } from "../hook.ts";
import monthNames from "../utils/monthNames.ts";
import { setCurrentSelectedSolarDate } from "../reducers/dateReducer.ts";
import LoginPopup from "./popup/LoginPopup.tsx";

const ICON_SIZE = 1.25;

const NavBar = () => {
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const accessToken = useAppSelector((s) => s.user.accessToken);
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

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!popupRef.current?.contains(e.target as Node)) {
                setLoginDialogOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='p-4 flex justify-between dark:bg-gray-800 dark:text-white'>
            <div className='flex justify-center items-center gap-2'>
                <button
                    aria-label='Previous month'
                    className='hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-800 rounded-full p-2 flex items-center justify-center'
                    onClick={() => changeMonth(-1)}>
                    <Icon path={mdiChevronLeft} size={ICON_SIZE} />
                </button>

                <p className='text-2xl font-bold w-70 text-center'>{label}</p>

                <button
                    aria-label='Next month'
                    className='hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-800 rounded-full p-2 flex items-center justify-center'
                    onClick={() => changeMonth(1)}>
                    <Icon path={mdiChevronRight} size={ICON_SIZE} />
                </button>

                <button
                    onClick={jumpToToday}
                    className='font-bold hover:bg-gray-100 active:bg-gray-200 rounded-xl border py-2 px-8 border-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-800'
                    aria-label='Jump to today'>
                    Hôm nay
                </button>
            </div>
            {!accessToken && (
                <div className='relative'>
                    <button
                        onClick={() => {
                            setLoginDialogOpen(true);
                        }}
                        className={`bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-lg flex items-center justify-center px-4 py-2 text-white font-bold`}>
                        Đăng nhập
                    </button>
                    {loginDialogOpen && <LoginPopup popupRef={popupRef} />}
                </div>
            )}
        </div>
    );
};

export default NavBar;
