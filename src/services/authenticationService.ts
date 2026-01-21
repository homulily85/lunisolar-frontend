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

export const getAccessToken = async () => {
    const getAccessTokenResult = await client.mutate<{
        refreshAccessToken: string | null;
    }>({
        mutation: REFRESH_ACCESS_TOKEN,
    });

    return getAccessTokenResult.data?.refreshAccessToken;
};

export const logout = async () => {
    await client.mutate({
        mutation: LOGOUT,
    });
};
