import { axiosNT } from "./Axios";
import { toast } from "react-toastify";

export const newOrganization = async (setLoading, token, data, next) => {
  setLoading(true);
  axiosNT
    .post(`/api/organization/neworg`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      next();
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};
