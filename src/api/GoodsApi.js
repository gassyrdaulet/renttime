import { axiosNT } from "./Axios";
import { toast } from "react-toastify";

export const createNewGood = async (
  setLoading,
  token,
  goodData,
  photo,
  next = () => {}
) => {
  setLoading(true);
  const formData = new FormData();
  formData.append("image", photo);
  Object.keys(goodData).forEach((key) => {
    formData.append(key, goodData[key]);
  });
  axiosNT
    .post(`/api/goods/new`, formData, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Новый товар успешно создан", { draggable: false });
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

export const editGood = async (
  setLoading,
  token,
  goodData,
  photo,
  next = () => {}
) => {
  setLoading(true);
  const formData = new FormData();
  formData.append("image", photo);
  Object.keys(goodData).forEach((key) => {
    formData.append(key, goodData[key]);
  });
  axiosNT
    .post(`/api/goods/edit`, formData, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Товар успешно отредактирован", { draggable: false });
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

export const createNewSpecie = async (
  setLoading,
  token,
  specieData,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(`/api/goods/newspecie`, specieData, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Новая единица успешно создана", { draggable: false });
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

export const editSpecie = async (
  setLoading,
  token,
  specieData,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(`/api/goods/editspecie`, specieData, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Единица успешно отредактирована", { draggable: false });
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

export const createNewGroup = async (
  setLoading,
  token,
  groupData,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(`/api/goods/newgroup`, groupData, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      const msg = data?.message;
      toast.success(msg ? msg : "Success", { draggable: false });
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

export const editGroup = async (
  setLoading,
  token,
  groupData,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(`/api/goods/editgroup`, groupData, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      const msg = data?.message;
      toast.success(msg ? msg : "Success", { draggable: false });
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

export const deleteGroup = async (setLoading, token, id, next = () => {}) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/goods/deletegroup`,
      { id },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(({ data }) => {
      const msg = data?.message;
      toast.success(msg ? msg : "Success", { draggable: false });
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

export const getAllGoods = async (
  setGoodsLoading,
  token,
  setGoods,
  params,
  setTotalCount,
  setFilteredTotalCount
) => {
  setGoodsLoading(true);
  axiosNT
    .get(`/api/goods/all`, {
      params,
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setGoods(data.goods);
      setTotalCount(data.totalCount);
      setFilteredTotalCount(data.filteredTotalCount);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setGoodsLoading(false);
    });
};

export const getAllSpecies = async (
  setLoading,
  token,
  setSpecies,
  params,
  setTotalCount,
  setFilteredTotalCount,
  setTotalSum
) => {
  setLoading(true);
  axiosNT
    .get(`/api/goods/getallspecies`, {
      params,
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setSpecies(data.species);
      setTotalCount(data.totalCount);
      setTotalSum(data.totalCompensationSum);
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

export const searchSpecie = async (setLoading, token, filter, setSpecies) => {
  setLoading(true);
  axiosNT
    .get(`/api/goods/searchspecie`, {
      params: { filter },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setSpecies(data);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getSpecies = async (setLoading, token, setSpecies, good_id) => {
  setLoading(true);
  axiosNT
    .get(`/api/goods/species`, {
      params: { good_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setSpecies(data);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const deleteGood = async (
  setLoading,
  token,
  good_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .delete(`/api/goods/deletegood`, {
      params: { good_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Товар успешно удален", { draggable: false });
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

export const deleteSpecie = async (
  setLoading,
  token,
  specie_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .delete(`/api/goods/deletespecie`, {
      params: { specie_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Единица успешно удалена", { draggable: false });
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

export const deleteImage = async (
  setLoading,
  token,
  good_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .delete(`/api/goods/deleteimage`, {
      params: { good_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Изображение успешно удалено", { draggable: false });
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

export const getGood = async (setLoading, token, setData, good_id) => {
  setLoading(true);
  axiosNT
    .get(`/api/goods/details`, {
      params: { good_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setData(data);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getAllGroups = async (setLoading, token, setGroups) => {
  setLoading(true);
  axiosNT
    .get(`/api/goods/allgroups`, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      setGroups(data);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getSpeciesXLSX = async (setLoading, token) => {
  setLoading(true);
  axiosNT
    .get(`/api/goods/getspeciesxlsx`, {
      responseType: "blob",
      headers: { Authorization: "Bearer " + token },
    })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventory.xlsx"); // Установка имени файла для скачивания
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};
