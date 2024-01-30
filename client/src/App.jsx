import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateListing from "./pages/CreateListing";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Privatepage from "./components/Privatepage";
import ListingDetails from "./pages/ListingDetails";
import Listing from "./pages/Listing";
const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/sign-in" element={<SignIn />} />
        <Route exact path="/sign-up" element={<SignUp />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/listing/:listingId" element={<Listing />} />

        <Route element={<Privatepage />}>
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/create-listing" element={<CreateListing />} />
          <Route exact path="/get/:listingId" element={<ListingDetails />} /> 


        </Route>
      </Routes>
    </>
  );
};

export default App;
