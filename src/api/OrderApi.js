import { axiosNT } from "./Axios";
import { toast } from "react-toastify";

export const createNewOrder = async (setLoading, token, data, next) => {
  setLoading(true);
  axiosNT
    .post(`/api/orders/neworder`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      next();
      toast.success("Новый заказ успешно создан");
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};
