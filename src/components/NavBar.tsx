import Icon from '@mdi/react';
import {mdiChevronLeft, mdiChevronRight} from '@mdi/js';

const NavBar = () => {
    return <div className="p-4 flex">
        <div className="flex justify-center items-center gap-2">
            <p className="text-2xl font-bold">Tháng ba 2025</p>
            <button className="hover:bg-gray-200 active:bg-gray-300 rounded-full">
                <Icon path={mdiChevronLeft} size={2}/>
            </button>
            <button className="hover:bg-gray-200 active:bg-gray-300 rounded-full">
                <Icon path={mdiChevronRight} size={2}/>
            </button>
            <button
                className="hover:bg-gray-200 active:bg-gray-300 rounded-xl border py-2 px-8 border-gray-1000">
                Hôm nay
            </button>
        </div>
    </div>;
};

export default NavBar;