import { AuthContext } from "../context";
import { useContext } from "react";

export default function useAuth() {
  const {
    isAuth,
    token,
    setToken,
    setFixed,
    isNoOrg,
    setIsAuth,
    isError,
    setIsError,
    currency,
    organizationId,
  } = useContext(AuthContext);
  return {
    setFixed,
    token,
    isNoOrg,
    setToken,
    setIsAuth,
    isAuth,
    setIsError,
    isError,
    currency,
    organizationId,
  };
}
