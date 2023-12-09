import { Navigate } from "react-router-dom";
import Auth from "../pages/Auth";
import Main from "../pages/Main";
import Error from "../pages/Error";
import Registration from "../pages/Registration";
import NoOrg from "../pages/NoOrg";
import Goods from "../pages/Goods";
import Card from "../pages/Card";
import Orders from "../pages/Orders";
import Contract from "../pages/Contract";

export const userRoutes = [
  { path: "/main", element: <Main></Main> },
  {
    path: "/contract/:organization_id/:order_id/:contract_code",
    element: <Contract></Contract>,
  },
  { path: "/cards", element: <Goods></Goods> },
  { path: "/cards/:id", element: <Card></Card> },
  { path: "/orders", element: <Orders></Orders> },
  { path: "/", element: <Navigate to="/main"></Navigate> },
  { path: "/auth", element: <Navigate to="/"></Navigate> },
  { path: "/*", element: <Navigate to="/"></Navigate> },
];

export const publicRoutes = [
  { path: "/auth", element: <Auth></Auth> },
  { path: "/registration", element: <Registration></Registration> },
  { path: "/*", element: <Navigate to="/auth"></Navigate> },
  {
    path: "/contract/:organization_id/:order_id/:contract_code",
    element: <Contract></Contract>,
  },
];

export const errorRoutes = [
  { path: "/error", element: <Error></Error> },
  { path: "/*", element: <Navigate to="/error"></Navigate> },
];

export const userRoutes2 = [
  { path: "/noorg", element: <NoOrg></NoOrg> },
  { path: "/", element: <Navigate to="/noorg"></Navigate> },
  { path: "/auth", element: <Navigate to="/"></Navigate> },
  {
    path: "/contract/:organization_id/:order_id/:contract_code",
    element: <Contract></Contract>,
  },
  { path: "/*", element: <Navigate to="/"></Navigate> },
];
