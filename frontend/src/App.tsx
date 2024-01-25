import Home from "./pages/Home";
import Thread from "./pages/Thread";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import CreateThread from "./pages/CreateThread";
import EditThread from "./pages/EditThread";
import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, orange } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
    palette: {
        primary: blue,
        secondary: orange,
    },
});

const App: React.FC = () => {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <ToastContainer />
                <Navbar />
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="thread/create" element={<CreateThread />} />
                    <Route path="/thread/:threadID" element={<Thread />} />
                    <Route path="/thread/:threadID/edit" element={<EditThread />} />
                </Routes>
            </ThemeProvider>
        </div>
    );
};

export default App;
