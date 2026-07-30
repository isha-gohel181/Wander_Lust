// client/src/components/layout/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingAssistantWidget from "@/components/assistant/FloatingAssistantWidget";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <FloatingAssistantWidget />
    </div>
  );
};

export default Layout;
