import { Context } from "../context";
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
    confrimModal,
    setConfirmModal,
  } = useContext(Context);
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
    confrimModal,
    setConfirmModal,
  };
}
