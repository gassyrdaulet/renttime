import { toast } from "react-toastify";
import { axiosNT } from "./Axios";

export const getDebts = async (setLoading, token, iin, setData) => {
  setLoading(true);
  axiosNT
    .get(`/api/clients/getdebts`, {
      params: { iin },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setData(data.violations);
      toast.success(data.message, { draggable: false });
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};
