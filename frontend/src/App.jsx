import React from "react";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-4 bg-gray-100">
        <h1 className="text-xl">Welcome to Your Worksite</h1>
      </div>
    </div>
  );
};

export default App;