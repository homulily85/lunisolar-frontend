import Calendar from "./components/Calendar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import NavBar from "./components/NavBar";
import AddNewEventDialog from "./components/dialog/AddNewEventDialog.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef, useState } from "react";
import {
    setAccessToken,
    setId,
    setName,
    setProfilePictureLink,
} from "./reducers/userReducer";
import { useAppDispatch } from "./hook";
import { CombinedGraphQLErrors } from "@apollo/client";
import { getAccessToken } from "./services/authenticationService.ts";
import { decodeAccessToken } from "./utils/misc.ts";
import DeleteEventDialog from "./components/dialog/DeleteEventDialog.tsx";
import ShowEventDetailDialog from "./components/dialog/ShowEventDetailDialog.tsx";

import {
    addFCMToken,
    requestFCMToken,
} from "./services/notificationService.ts";

const App = () => {
    const [theme, setTheme] = useState<"light" | "dark">(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    );
    const dispatch = useAppDispatch();
    const ranRef = useRef(false);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) =>
            setTheme(e.matches ? "dark" : "light");
        media.addEventListener("change", handler);
        return () => {
            media.removeEventListener("change", handler);
        };
    }, [dispatch]);

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;
        (async () => {
            try {
                const accessToken = await getAccessToken();
                if (!accessToken) {
                    console.log("invalid credentials");
                    return;
                }

                const payload = decodeAccessToken(accessToken);

                dispatch(setAccessToken(accessToken));
                dispatch(setId(payload.id));
                dispatch(setName(payload.name));
                dispatch(setProfilePictureLink(payload.profilePictureLink));

                let fcmToken = localStorage.getItem("fcmToken");
                if (!fcmToken) {
                    fcmToken = await requestFCMToken();
                    if (fcmToken) {
                        localStorage.setItem("fcmToken", fcmToken);
                        await addFCMToken(fcmToken);
                    }
                }
            } catch (e) {
                if (e instanceof CombinedGraphQLErrors) {
                    return;
                }
                console.error(e);
            }
        })();
    }, [dispatch]);

    return (
        <div
            className={
                "h-screen w-screen grid grid-cols-[1fr_5fr] grid-rows-[auto_1fr]"
            }>
            <div className='row-span-2 relative'>
                <Sidebar />
            </div>

            <NavBar />

            <div className='h-full min-h-0'>
                <Calendar />
            </div>
            <AddNewEventDialog />
            <DeleteEventDialog />
            <ShowEventDetailDialog />
            <ToastContainer
                theme={theme}
                position='top-right'
                autoClose={3000}
            />
        </div>
    );
};

export default App;
