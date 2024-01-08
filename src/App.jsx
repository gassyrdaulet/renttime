import "./styles/App.css";
import { useState, useRef, useEffect } from "react";
import { Context } from "./context";
import AppRouter from "./components/AppRouter";
import Header from "./components/Header/Header";
import { getAuth, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import Loading from "./components/Loading";
import { ping, authCheck } from "./api/AuthApi";
import { ToastContainer } from "react-toastify";
import Logo from "./components/Header/Logo";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import AsyncConfirmModal from "./components/AsyncConfirmModal";

const forbiddenRoutesToMemorize = [
  "/noorg",
  "/auth",
  "/registration",
  "/error",
  "/",
];
const forbiddenRoutesToNavigate = ["/contract"];

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isNoOrg, setIsNoOrg] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [text, setText] = useState("");
  const [organizationId, setOrganizationId] = useState();
  const [isNoOrgLoading, setIsNoOrgLoading] = useState(false);
  const [token, setToken] = useState("");
  const [currency] = useState("KZT");
  const [lastScroll, setLastScroll] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const AppRef = useRef(null);

  useEffect(() => {
    if (!isAuth || isNoOrg || isError) {
      return;
    }
    for (let route of forbiddenRoutesToMemorize) {
      if (location.pathname === route) {
        return;
      }
    }
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname, isAuth, isNoOrg, isError]);

  useEffect(() => {
    const lastRoute = localStorage.getItem("lastRoute");
    if (lastRoute) {
      if (isAuth && !isNoOrg && !isError) {
        for (let route of forbiddenRoutesToNavigate) {
          if (lastRoute.startsWith(route)) {
            return;
          }
        }
        navigate(lastRoute);
      }
    }
  }, [navigate, isAuth, isNoOrg, isError]);

  useEffect(() => {
    try {
      const auth = getAuth();
      onIdTokenChanged(auth, async (user) => {
        if (user) {
          setToken(await user.getIdToken());
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    setIsAuthLoading(true);
    try {
      const auth = getAuth();
      onAuthStateChanged(auth, async (userCred) => {
        try {
          if (userCred) {
            setIsError(false);
            const newToken = await userCred.getIdToken();
            await authCheck(setIsAuth, newToken, setToken);
            return;
          }
          setIsError(false);
          setIsAuth(false);
          setToken("");
        } catch (e) {
          console.log(e);
        } finally {
          setIsAuthLoading(false);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      ping(setIsNoOrg, setIsNoOrgLoading, setIsError, token, setOrganizationId);
    }
  }, [isAuth, token]);

  const handleScroll = () => {
    if (fixed) {
      AppRef.current.scrollTop = lastScroll;
    } else {
      setLastScroll(AppRef.current.scrollTop);
    }
  };

  return (
    <div className="App" ref={AppRef} onScroll={handleScroll}>
      <Context.Provider
        value={{
          isAuth,
          setIsAuth,
          isError,
          setIsError,
          token,
          setToken,
          isNoOrg,
          setFixed,
          organizationId,
          currency,
          confirmModal,
          setConfirmModal,
          text,
          setText,
        }}
      >
        {isAuthLoading && (
          <div className="LoadingScreen">
            <Loading />
            Проверка аутентификации...
          </div>
        )}
        {isNoOrgLoading && (
          <div className="LoadingScreen">
            <Loading />
            Проверка организации...
          </div>
        )}
        {isAuth && !location.pathname.startsWith("/contract/") ? (
          <Header />
        ) : (
          <Logo />
        )}
        <AppRouter />
        <ToastContainer />
        <AsyncConfirmModal />
      </Context.Provider>
    </div>
  );
}
