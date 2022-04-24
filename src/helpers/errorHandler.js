import { getErrorPath } from "ajv/dist/compile/util";
import { camelCase, omitBy, isNil, find } from "lodash";
// import useRefreshToken from "Hooks/refresh-token.hook";
import errors from "./errors.json";

const errorHandler = async ({ error, callback = null, redirect = null }) => {
  console.error("error from API", error)
  if (error?.type === "UNAUTHORIZED") {
    console.log("error type is unauthorized");
    return { error: { description: "unauthorized"}}
    // const isRefreshSuccess = await useRefreshToken(opt?.noRedirect);
    // if (isRefreshSuccess && opt?.callback) await opt.callback();
    // return omitBy({ ...error, value: errorMessage, stack }, isNil)
  }

  // const matchedError = find(errors, e => e.errorCode === error.errorCode);
  // let errorDescription = matchedError?.description;

  const defaultDescription = "Oops. Something went wrong. We're really sorry. Please try again later."

  return {
    ...error, 
    description: error.description || defaultDescription
  };
}
export default errorHandler;
