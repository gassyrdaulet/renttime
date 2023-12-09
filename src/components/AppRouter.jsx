import { Route, Routes } from "react-router-dom";
import { publicRoutes, userRoutes, errorRoutes, userRoutes2 } from "../router";
import useAuth from "../hooks/useAuth";

function AppRouter() {
  const { isAuth, isError, isNoOrg } = useAuth();

  return isError ? (
    <Routes>
      {errorRoutes.map(({ path, element }) => (
        <Route path={path} element={element} key={path} />
      ))}
    </Routes>
  ) : isAuth ? (
    isNoOrg ? (
      <Routes>
        {userRoutes2.map(({ path, element }) => (
          <Route path={path} element={element} key={path} />
        ))}
      </Routes>
    ) : (
      <Routes>
        {userRoutes.map(({ path, element }) => (
          <Route path={path} element={element} key={path} />
        ))}
      </Routes>
    )
  ) : (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route path={path} element={element} key={path} />
      ))}
    </Routes>
  );
}

export default AppRouter;
