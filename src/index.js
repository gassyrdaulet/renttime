import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { app } from "./config/firebase.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log(app.name);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
