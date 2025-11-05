import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { InfoModalProvider } from "./custom-components/modals";
import { BrowserRouter } from "react-router";

import "./index.css";


const root = createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <BrowserRouter>
        <InfoModalProvider>
            <App />
        </InfoModalProvider>
        </BrowserRouter>
    </StrictMode>
);
