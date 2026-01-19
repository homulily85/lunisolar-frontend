import Calendar from "./components/calendar/Calendar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import NavBar from "./components/NavBar.tsx";
import AddNewEvent from "./components/newEvent/AddNewEvent.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { REFRESH_ACCESS_TOKEN } from "./graphql/query.ts";
import decodeAccessToken from "./utils/decodeAccessToken.ts";
import {
    setAccessToken,
    setName,
    setProfilePictureLink,
    setUserId,
} from "./reducers/userReducer.ts";
import { useAppDispatch } from "./hook.ts";

function App() {
    const [theme, setTheme] = useState<"light" | "dark">(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    );
    const client = useApolloClient();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const handler = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "dark" : "light");
        };

        media.addEventListener("change", handler);

        client
            .mutate<{
                refreshAccessToken: string | null;
            }>({
                mutation: REFRESH_ACCESS_TOKEN,
            })
            .then((getAccessTokenResult) => {
                const accessToken =
                    getAccessTokenResult.data?.refreshAccessToken;

                if (!accessToken) {
                    console.log("invalid credentials");
                    return;
                }

                const payload = decodeAccessToken(accessToken);
                dispatch(setAccessToken(accessToken));
                dispatch(setUserId(payload.userId));
                dispatch(setName(payload.name));
                dispatch(setProfilePictureLink(payload.profilePictureLink));
            });

        return () => {
            media.removeEventListener("change", handler);
        };
    }, [client, dispatch]);

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
