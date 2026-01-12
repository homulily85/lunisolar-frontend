import {useCallback, useMemo} from 'react';
import Icon from '@mdi/react';
import {mdiMenu, mdiPlus} from '@mdi/js';
import {useAppDispatch, useAppSelector} from '../hook';
import {setShowDialog, setShowSidebar} from '../reducers/uiReducer';
import monthNames from '../utils/monthNames';
import {LunarCalendar} from '@dqcai/vn-lunar';

const Sidebar = () => {
    const showSidebar = useAppSelector(state => state.ui.showSidebar);
    const selectedTs = useAppSelector(state => state.date.currentSelectedSolarDate);

    const currentSelectedSolarDate = useMemo(() => new Date(selectedTs), [selectedTs]);

    const selectedLunarDate = useMemo(() => {
        const d = currentSelectedSolarDate;
        if (Number.isNaN(d.getTime())) {
            return null;
        }
        try {
            return LunarCalendar.fromSolar(d.getDate(), d.getMonth() + 1, d.getFullYear());
        } catch {
            return null;
        }
    }, [currentSelectedSolarDate]);

    const dispatch = useAppDispatch();
    const toggleSidebar = useCallback(() => dispatch(setShowSidebar(!showSidebar)), [dispatch, showSidebar]);

    const day = currentSelectedSolarDate.getDate();
    const month = monthNames[currentSelectedSolarDate.getMonth()] ?? '';
    const year = currentSelectedSolarDate.getFullYear();

    const lunarDay = selectedLunarDate?.lunarDate?.day ?? '';
    const lunarMonth = selectedLunarDate?.lunarDate?.month ?? '';
    const lunarLeap = selectedLunarDate?.lunarDate?.leap ? ' (nhuận)' : '';
    const lunarYearCanChi = selectedLunarDate?.yearCanChi ?? '';

    return (
        <div
            className="h-screen grid grid-rows-[1fr_10fr] p-2 bg-gray-150 dark:bg-gray-900 dark:text-white">
            <div>
                <button
                    aria-label="Toggle sidebar"
                    className="hover:bg-gray-200 active:bg-gray-300
                      dark:hover:bg-gray-700 dark:active:bg-gray-800
                     rounded-md w-max h-max mt-3"
                    onClick={toggleSidebar}
                >
                    <Icon path={mdiMenu} size={2}/>
                </button>
            </div>

            {showSidebar && (
                <div>
                    <p className="text-9xl font-bold text-center text-orange-600">{day}</p>
                    <p className="text-center font-bold text-3xl">{month}</p>
                    <p className="text-center font-bold text-3xl">{year}</p>
                    <p className="text-center font-bold text-xl mt-1">
                        {lunarDay} tháng {lunarMonth}
                        {lunarLeap}, {lunarYearCanChi}
                    </p>

                    <div className="flex justify-center mt-4">
                        <button onClick={() => dispatch(setShowDialog(true))}
                                aria-label="Add"
                                className="px-4 py-2 rounded-md text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 font-bold text-lg"
                        >
                            <Icon path={mdiPlus} size={1} className="inline pb-1"/> Thêm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;