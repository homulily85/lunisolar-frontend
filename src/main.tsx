import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { API_URL } from "./config.ts";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
    link: new HttpLink({
        uri: `${API_URL}/graphql`,
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
