import { AUTH, LOGOUT, REFRESH_ACCESS_TOKEN } from "../graphql/query.ts";
import client from "../graphql/client.ts";

export const auth = async (credential: string) => {
    const authResult = await client.mutate<
        { auth: string },
        { oauthToken: string }
    >({
        mutation: AUTH,
        variables: { oauthToken: credential },
    });

    return authResult.data?.auth === "success";
};

export const getAccessToken = async (): Promise<string | null> => {
    try {
        const response = await fetch("/api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                query: REFRESH_ACCESS_TOKEN,
            }),
        });

        const result = await response.json();
        return result.data?.refreshAccessToken || null;
    } catch (error) {
        console.error("Error fetching new access token:", error);
        throw error;
    }
};

export const logout = async () => {
    await client.mutate({
        mutation: LOGOUT,
    });
};
