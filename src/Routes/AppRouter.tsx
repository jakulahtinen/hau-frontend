import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Photospage from "../components/photospage";
import Mainpage from "../components/mainpage";
import Videospage from "../components/videospage";
import Joinpage from "../components/joinpage";
import Contactpage from "../components/contactpage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/photos" element={<Photospage />} />
            <Route path="/videos" element={<Videospage />} />
            <Route path="/join" element={<Joinpage />} />
            <Route path="/contact" element={<Contactpage />} />
        </Routes>
    );
};

export default AppRouter;
