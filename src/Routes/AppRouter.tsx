import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Photospage from "../components/photospage";
import Mainpage from "../components/mainpage";
import Joinpage from "../components/joinpage";
import Contactpage from "../components/contactpage";
import Newspage from "../components/newspage";
import Newsdetail from "../components/newsdetail";
import Loginpage from "../components/loginpage";
import Adminpanel from "../components/adminpage";
import Addpicture from "../components/addpicture";
import ProtectedRoute from "../components/protectedroute";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/events" element={<Newspage />} />
            <Route path="news/:id" element={<Newsdetail />} ></Route>
            <Route path="/photos" element={<Photospage />} />
            <Route path="/join" element={<Joinpage />} />
            <Route path="/contact" element={<Contactpage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Adminpanel />} />
                <Route path="/addpicture" element={<Addpicture />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;