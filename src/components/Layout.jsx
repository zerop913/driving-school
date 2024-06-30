import React from "react";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-light">
      <Navigation />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
