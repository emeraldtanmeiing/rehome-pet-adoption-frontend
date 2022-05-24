import React, { useEffect } from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import AuthContext from "./context/authContext";
import { AllRoutes } from "./Routes";
import { Helmet } from "react-helmet";

import Navbar from "./components/navbar";

import "./App.less";
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
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div className="app">
        <Helmet>
          <title>{process.env.REACT_APP_TITLE}</title>
        </Helmet>
        <Navbar />
        <div className="stack-screen">
          <AllRoutes />
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
