import { createContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // const [auth, setAuth] = useState({});

    return (
        // <AuthContext.Provider value={{ auth, setAuth }}>
        <AuthContext.Provider value="hello from authcontextprovider">
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;