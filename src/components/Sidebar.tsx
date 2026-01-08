import Icon from '@mdi/react';
import {mdiMenu, mdiPlus} from '@mdi/js';
import {useAppDispatch, useAppSelector} from '../hook.ts';
import {setShowSidebar} from '../reducers/uiReducer.ts';

const Sidebar = () => {
    const showSidebar = useAppSelector(state => state.ui.showSidebar);
    const dispatch = useAppDispatch();

    const changeShowSidebar = () => {
        dispatch(setShowSidebar(!showSidebar));
    };

    return <div className="h-screen grid grid-rows-[1fr_10fr] p-2 bg-gray-150">
        <div className="">
            <button className="hover:bg-gray-200 active:bg-gray-300 rounded-md w-max h-max mt-3"
                    onClick={changeShowSidebar}>
                <Icon path={mdiMenu} size={2}/>
            </button>
        </div>
        {showSidebar && (
            <div>
                <p className="text-9xl font-bold text-center text-orange-600 ">19</p>
                <p className="text-center font-bold text-3xl">Tháng ba 2025</p>
                <p className="text-center font-bold text-xl mt-1 ">19 Tháng ba 2025 </p>
                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 rounded-md text-white bg-orange-600
                         hover:bg-orange-700 active:bg-orange-800 font-bold text-lg">
                        <Icon path={mdiPlus} size={1} className="inline pb-1"/> Thêm
                    </button>
                </div>
            </div>
        )}

    </div>;
};

export default Sidebar;