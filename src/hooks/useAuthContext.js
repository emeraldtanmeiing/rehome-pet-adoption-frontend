import { useContext } from "react";
import AuthContext from "../context/authContext";

const useAuthContext = () => {
  const Auth = useContext(AuthContext);
  const accountType = Auth.auth?.type;
  const accountID = Auth.auth?.accountID;

  return { accountType, accountID }
}

export default useAuthContext;