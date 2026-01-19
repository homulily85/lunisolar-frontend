import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
    link: new HttpLink({
        uri: `/api/graphql`,
        credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </ApolloProvider>
    </StrictMode>,
);
