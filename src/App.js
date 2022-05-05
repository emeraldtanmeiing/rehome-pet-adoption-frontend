import React, { useEffect } from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import AuthContext from "./context/authContext";
import { AllRoutes } from "./Routes";

import Navbar from "./components/navbar";

import "./App.scss";

function App() {
  const [auth, setAuth] = useState(false);

  const readCookie = () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const type = Cookies.get("type");
    const accountID = Cookies.get("accountID");

    if (accessToken && refreshToken && type && accountID) {
      setAuth({ type, accountID });
    }

    console.log("read cookie")
    console.log({auth})
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div className="app">
        <Navbar />
        <div className="stack-screen">
          <AllRoutes />
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
