import {
    ApolloClient,
    ApolloLink,
    CombinedGraphQLErrors,
    HttpLink,
    InMemoryCache,
    Observable,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import store from "../store.ts";
import { ErrorLink } from "@apollo/client/link/error";
import { getAccessToken } from "../services/authenticationService.ts";
import { setAccessToken } from "../reducers/userReducer.ts";

const errorLink = new ErrorLink(({ error, operation, forward }) => {
    if (
        CombinedGraphQLErrors.is(error) &&
        error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED")
    ) {
        return new Observable((observer) => {
            getAccessToken()
                .then((newToken) => {
                    if (!newToken) {
                        throw new Error("No token returned");
                    }

                    store.dispatch(setAccessToken(newToken));

                    const oldHeaders = operation.getContext().headers;
                    operation.setContext({
                        headers: {
                            ...oldHeaders,
                            authorization: `Bearer ${newToken}`,
                        },
                    });

                    const subscriber = {
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    };

                    forward(operation).subscribe(subscriber);
                })
                .catch(() => {
                    store.dispatch(setAccessToken(""));
                });
        });
    } else {
        console.error(`[Error]: ${error}`);
    }
});

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
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;
