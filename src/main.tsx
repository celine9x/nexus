import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { Informational01 } from "./pages/informational-01";
import { Settings01 } from "./pages/settings-01";
import OpportunityPage from "./pages/opportunity/index";
import AgreementPage from "./pages/agreement/index";
import AlliancePage from "./pages/alliance/index";
import ObligationPage from "./pages/obligation";

import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { DataProvider } from "@/contexts/DataContext";
import { AlertProvider } from "@/contexts/AlertContext";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <DataProvider>
            <ThemeProvider defaultTheme="light">
                <AlertProvider>
                    <BrowserRouter>
                        <RouteProvider>
                            <Routes>
                                <Route path="/" element={<Informational01 />} />
                                <Route path="/settings" element={<Settings01 />} />
                                <Route path="/opportunity" element={<OpportunityPage />} />
                                <Route path="/agreement" element={<AgreementPage />} />
                                <Route path="/alliance" element={<AlliancePage />} />
                                <Route path="/obligation" element=
                                {<ObligationPage/>}/>
                            </Routes>
                        </RouteProvider>
                    </BrowserRouter>
                </AlertProvider>
            </ThemeProvider>
        </DataProvider>
    </StrictMode>,
);
