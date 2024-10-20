import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgetPassword";
import Verification from "./Verification";
import ResetPassword from "./ResetPassword";
import Events from "./Events";
import RequestedEvents from "./RequestedEvents";
import EventForm from "./EventForm";
import Gallery from "./Gallery";
import Apply from "./Apply";
import History from "./History";
import Teams from "./Teams";
import Announcements from "./Announcements";
import Tasks from "./Tasks";
import Blog from "./Blog";
import ProfilePage from "./ProfilePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/requestedevents" element={<RequestedEvents />} />
        <Route path="/EventForm" element={<EventForm />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/history" element={<History />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/blog" element={<Blog />} />
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/profilepage" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
