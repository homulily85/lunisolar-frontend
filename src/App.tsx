import Calendar from "./components/calendar/Calendar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import NavBar from "./components/NavBar.tsx";
import AddNewEvent from "./components/new_event/AddNewEvent.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

function App() {
    const [theme, setTheme] = useState<"light" | "dark">(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    );

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const handler = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "dark" : "light");
        };

        media.addEventListener("change", handler);

        return () => {
            media.removeEventListener("change", handler);
        };
    }, []);

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
                theme={theme}
                position='top-right'
                autoClose={3000}
            />
        </div>
    );
}

export default App;
