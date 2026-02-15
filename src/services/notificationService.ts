import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../utils/firebaseApp.ts";
import { ADD_FCM_TOKEN, REMOVE_FCM_TOKEN } from "../graphql/query.ts";
import client from "../graphql/client.ts";

export const addFCMToken = async (token: string) => {
    await client.mutate<{ addFcmToken: string }, { fcmToken: string }>({
        mutation: ADD_FCM_TOKEN,
        variables: { fcmToken: token },
    });
};

export const removeFCMToken = async (token: string) => {
    await client.mutate<{ removeFcmToken: string }, { fcmToken: string }>({
        mutation: REMOVE_FCM_TOKEN,
        variables: { fcmToken: token },
    });
};

export const requestFCMToken = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        const messaging = getMessaging(firebaseApp);
        const token = await getToken(messaging, {
            vapidKey:
                "BJzxmhzFDQ-NQG1kQlIW293w2grbc-RbVsVXsmGVf5K72mke7pjh6RKmju0A-X56UMstlpZ4VrkCS6OfIMXQstw",
        });

        if (token) {
            localStorage.setItem("fcmToken", token);
            return token;
        } else {
            console.warn("No registration token available.");
            return null;
        }
    } else {
        return null;
    }
};
