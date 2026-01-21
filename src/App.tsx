import Calendar from "./components/calendar/Calendar";
import Sidebar from "./components/Sidebar";
import NavBar from "./components/NavBar";
import AddNewEvent from "./components/newEvent/AddNewEvent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import decodeAccessToken from "./utils/decodeAccessToken";
import {
    setAccessToken,
    setName,
    setProfilePictureLink,
    setUserId,
} from "./reducers/userReducer";
import { useAppDispatch } from "./hook";
import { CombinedGraphQLErrors } from "@apollo/client";
import { getAccessToken } from "./services/authenticationService.ts";

const App = () => {
    const [theme, setTheme] = useState<"light" | "dark">(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) =>
            setTheme(e.matches ? "dark" : "light");
        media.addEventListener("change", handler);

        (async () => {
            try {
                const accessToken = await getAccessToken();

                if (!accessToken) {
                    console.log("invalid credentials");
                    return;
                }

                const payload = decodeAccessToken(accessToken);

                dispatch(setAccessToken(accessToken));
                dispatch(setUserId(payload.userId));
                dispatch(setName(payload.name));
                dispatch(setProfilePictureLink(payload.profilePictureLink));
            } catch (e) {
                if (e instanceof CombinedGraphQLErrors) {
                    return;
                }
                console.error(e);
            }
        })();

        return () => {
            media.removeEventListener("change", handler);
        };
    }, [dispatch]);

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
};

export default App;
