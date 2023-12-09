import { axiosNT } from "./Axios";
import { toast } from "react-toastify";

export const createNewGood = async (
  setLoading,
  token,
  goodData,
  photo,
  next
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
