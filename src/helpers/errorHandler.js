import { getErrorPath } from "ajv/dist/compile/util";
import { camelCase, omitBy, isNil, find } from "lodash";
// import useRefreshToken from "Hooks/refresh-token.hook";
// import errors from "./errors.json";
import Cookies from "js-cookie";
import { refreshAccess } from "../services/auth.services.js";

const errorHandler = async ({ error, callback = null, redirect = null }) => {
  console.error("error from API", error);

  // const matchedError = find(errors, e => e.errorCode === error.errorCode);
  // let errorDescription = matchedError?.description;
  const defaultDescription =
    "Oops. Something went wrong. We're really sorry. Please try again later.";

  if (error?.errorObject === "TokenExpiredError jwt expired") {
    const isRefreshSuccess = await refreshAccess();

    let res;
    if (isRefreshSuccess && callback) {
      res = await callback();
    }
    return res;
  }

  return {
    ...error,
    description: error.description || defaultDescription,
  };
};

export default errorHandler;
