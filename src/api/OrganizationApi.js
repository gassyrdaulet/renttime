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

export const newMethod = async (setLoading, token, data, next) => {
  setLoading(true);
  axiosNT
    .post(`/api/organization/createmethod`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Метод успешно добавлен", { draggable: false });
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

export const editMethodOption = async (
  setLoading,
  token,
  method_id,
  option,
  next
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/organization/changemethodoption`,
      { method_id, option },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Опция метода успешно отредактирована", {
        draggable: false,
      });
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

export const editMethod = async (setLoading, token, data, next) => {
  setLoading(true);
  axiosNT
    .post(`/api/organization/editmethod`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Метод успешно отредактирован", {
        draggable: false,
      });
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
      toast.success("Пользователь был успешно добавлен в организацию", {
        draggable: false,
      });
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const deleteUser = async (
  setLoading,
  token,
  user_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .delete(`/api/organization/deleteuser`, {
      params: { user_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      next();
      toast.success("Пользователь был успешно выгнан из организации", {
        draggable: false,
      });
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const deleteMethod = async (
  setLoading,
  token,
  method_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .delete(`/api/organization/deletemethod`, {
      params: { method_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      next();
      toast.success("Метод был успешно удален", {
        draggable: false,
      });
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const grantPrivilege = async (
  setLoading,
  token,
  user_id,
  privilege,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/organization/grantprivilege`,
      { user_id, privilege },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      next();
      toast.success("Доступ успешно предоставлен", { draggable: false });
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};
