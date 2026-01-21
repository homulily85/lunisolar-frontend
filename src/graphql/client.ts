import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import store from "../store.ts";

const authLink = new SetContextLink(({ headers }) => {
    const token = store.getState().user.accessToken;
    return {
        headers: {
            ...headers,
            ...(token && { authorization: `Bearer ${token}` }),
        },
    };
});

const httpLink = new HttpLink({
    uri: `/api/graphql`,
    credentials: "same-origin",
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
