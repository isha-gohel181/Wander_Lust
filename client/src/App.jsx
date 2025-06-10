// client/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <>
              <SignedIn>
                <Profile />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/bookings"
          element={
            <>
              <SignedIn>
                <Bookings />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
