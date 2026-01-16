import Calendar from "./components/calendar/Calendar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import NavBar from "./components/NavBar.tsx";
import AddNewEvent from "./components/new_event/AddNewEvent.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <ToastContainer
                theme={"dark"}
                position='top-right'
                autoClose={3000}
            />
        </div>
    );
}

export default App;
