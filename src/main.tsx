import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import { ApolloProvider } from "@apollo/client/react";
import client from "./graphql/client.ts";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </ApolloProvider>
    </StrictMode>,
);
