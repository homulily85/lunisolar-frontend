import Calendar from './components/Calendar.tsx';
import Sidebar from './components/Sidebar.tsx';
import NavBar from './components/NavBar.tsx';
import {useAppSelector} from './hook.ts';

function App() {
    const showSidebar = useAppSelector(state => state.ui.showSidebar);
    if (!showSidebar) {
        return <div className="h-screen w-screen grid grid-cols-[1fr_25fr] grid-rows-[1fr_10fr]">
            <div className="row-span-2">
                <Sidebar></Sidebar>
            </div>
            <NavBar></NavBar>
            <Calendar></Calendar>
        </div>;
    }

    return <div className="h-screen w-screen grid grid-cols-[1fr_5fr] grid-rows-[1fr_10fr]">
        <div className="row-span-2">
            <Sidebar></Sidebar>
        </div>
        <NavBar></NavBar>
        <Calendar></Calendar>
    </div>;
}

export default App;
