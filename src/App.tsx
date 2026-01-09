import Calendar from './components/calendar/Calendar.tsx';
import Sidebar from './components/Sidebar.tsx';
import NavBar from './components/NavBar.tsx';
import {useAppSelector} from './hook.ts';

function App() {
    const showSidebar = useAppSelector(state => state.ui.showSidebar);

    const gridCols = showSidebar ? 'grid-cols-[1fr_6fr]' : 'grid-cols-[1fr_25fr]';

    return (
        <div className={`h-screen w-screen grid ${gridCols} grid-rows-[auto_1fr]`}>
            <div className="row-span-2 h-full">
                <Sidebar/>
            </div>

            <NavBar/>

            <div className="h-full min-h-0">
                <Calendar/>
            </div>
        </div>
    );
}

export default App;
