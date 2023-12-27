import { axiosNT } from "./Axios";
import { toast } from "react-toastify";

export const createNewClientKZ = async (setLoading, token, data, next) => {
  setLoading(true);
  axiosNT
    .post(`/api/clients/newclientkz`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      next();
      toast.success("Новый пользователь успешно сохранен");
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const editClientKZ = async (setLoading, token, data, next) => {
  setLoading(true);
  axiosNT
    .post(`/api/clients/editclientkz`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      next();
      toast.success("Пользователь успешно отредактирован");
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const searchClientKZ = async (
  setLoading,
  token,
  searchText,
  setClients
) => {
  setLoading(true);
  axiosNT
    .get(`/api/clients/searchclientkz`, {
      params: { searchText },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setClients(data);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getClientByIdKZ = async (
  setLoading,
  token,
  setData,
  client_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .get(`/api/clients/getclientbyidkz`, {
      params: { client_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setData(data);
      next();
    })
    .catch((e) => {
      console.log(e);
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getAllClients = async (
  setLoading,
  token,
  setClients,
  params,
  setFilteredTotalCount
) => {
  setLoading(true);
  axiosNT
    .get(`/api/clients/all`, {
      params,
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setClients(data.clients);
      setFilteredTotalCount(data.filteredTotalCount);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};
