import Calendar from "./components/calendar/Calendar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import NavBar from "./components/NavBar.tsx";
import AddNewEvent from "./components/new_event/AddNewEvent.tsx";

function App() {
    return (
        <div
            className={
                "h-screen w-screen grid grid-cols-[1fr_5fr] grid-rows-[auto_1fr]"
            }>
            <div className='row-span-2 h-full'>
                <Sidebar />
            </div>

            <NavBar />

            <div className='h-full min-h-0'>
                <Calendar />
            </div>
            <AddNewEvent />
        </div>
    );
}

export default App;
