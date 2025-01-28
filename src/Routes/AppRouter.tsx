import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Photospage from "../components/photospage";
import Mainpage from "../components/mainpage";
import Videospage from "../components/videospage";
import Joinpage from "../components/joinpage";
import Contactpage from "../components/contactpage";
import Newspage from "../components/newspage";
import Loginpage from "../components/loginpage";
import Adminpanel from "../components/adminpage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/events" element={<Newspage />} />
            <Route path="/photos" element={<Photospage />} />
            <Route path="/videos" element={<Videospage />} />
            <Route path="/join" element={<Joinpage />} />
            <Route path="/contact" element={<Contactpage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/admin" element={<Adminpanel />} />
        </Routes>
    );
};

export default AppRouter;