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
import OrderDetails from "../pages/OrderDetails";
import Deliveries from "../pages/Deliveries";
import DeliveryDetails from "../pages/DeliveryDetails";
import Settings from "../pages/Settings";
import Clients from "../pages/Clients";
import ClientDetails from "../pages/ClientDetails";
import Species from "../pages/Species";
import Workshifts from "../pages/Workshifts";
import WorkshiftDetails from "../pages/WorkshiftDetails";
import ABC from "../pages/ABC";

export const userRoutes = [
  { path: "/main", element: <Main></Main> },
  {
    path: "/contract/:organization_id/:order_id/:contract_code",
    element: <Contract></Contract>,
  },
  { path: "/goods/cards/:group/:page", element: <Goods></Goods> },
  { path: "/goods/cards/:group/:page/:id", element: <Card></Card> },
  { path: "/goods/species/:group/:page", element: <Species></Species> },
  { path: "/orders/:group/:page", element: <Orders></Orders> },
  { path: "/orders/:group/:page/:id", element: <OrderDetails></OrderDetails> },
  { path: "/deliveries/:group/:page", element: <Deliveries></Deliveries> },
  {
    path: "/deliveries/:group/:page/:id",
    element: <DeliveryDetails></DeliveryDetails>,
  },
  { path: "/workshifts/:page", element: <Workshifts></Workshifts> },
  {
    path: "/workshifts/:page/:id",
    element: <WorkshiftDetails></WorkshiftDetails>,
  },
  { path: "/settings/:group", element: <Settings></Settings> },
  { path: "/clients/:page", element: <Clients></Clients> },
  { path: "/clients/:page/:id", element: <ClientDetails></ClientDetails> },
  { path: "/summaries/ABC", element: <ABC></ABC> },
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
