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

export const getMethods = async (
  setLoading,
  token,
  setMethods,
  courier_access = false
) => {
  setLoading(true);
  axiosNT
    .get(`/api/organization/methods`, {
      params: { courier_access },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setMethods(data.methods);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getCouriers = async (setLoading, token, setCouriers) => {
  setLoading(true);
  axiosNT
    .get(`/api/organization/users`, {
      params: { role: "courier" },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setCouriers(data.users);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getAllUsers = async (setLoading, token, setUsers) => {
  setLoading(true);
  axiosNT
    .get(`/api/organization/users`, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      // console.log(data.users);
      setUsers(data.users);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const addNewUser = async (
  setLoading,
  token,
  user_id,
  roles,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/organization/newuser`,
      { roles, user_id },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
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
