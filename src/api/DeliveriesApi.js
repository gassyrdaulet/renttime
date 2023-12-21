import { axiosNT } from "./Axios";
import { toast } from "react-toastify";

export const getDeliveries = async (
  setLoading,
  token,
  setDeliveries,
  params,
  setFilteredTotalCount = () => {},
  setTotalCount = () => {}
) => {
  setLoading(true);
  axiosNT
    .get(`/api/deliveries/all`, {
      params,
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      //   console.log(data.deliveries);
      setDeliveries(data.deliveries);
      setFilteredTotalCount(data.filteredTotalCount);
      setTotalCount(data.totalCount);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const getDeliveryDetails = async (
  setLoading,
  token,
  setDeliveryInfo,
  delivery_id
) => {
  setLoading(true);
  axiosNT
    .get(`/api/deliveries/details`, {
      params: { delivery_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      //   console.log(data);
      setDeliveryInfo(data);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const sendCourier = async (
  setLoading,
  token,
  deliveries,
  courier_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/deliveries/send`,
      {
        deliveries,
        courier_id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(({ data }) => {
      toast.success(
        `Доставки успешно отправлены ${
          data.totalSuccess ? `(${data.totalSuccess}/${deliveries.length})` : ""
        }`,
        {
          draggable: false,
        }
      );
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

export const finishDeliveries = async (
  setLoading,
  token,
  deliveries,
  comment,
  next = () => {}
) => {
  setLoading(true);
  const body = { deliveries };
  if (comment) {
    body.comment = comment;
  }
  axiosNT
    .post(`/api/deliveries/finish`, body, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      toast.success(
        `Доставки успешно подтверждены ${
          data.totalSuccess ? `(${data.totalSuccess}/${deliveries.length})` : ""
        }`,
        {
          draggable: false,
        }
      );
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

export const issueDelivery = async (
  setLoading,
  token,
  delivery_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/deliveries/issue`,
      {},
      {
        params: {
          delivery_id,
        },
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success(`Доставка успешно выдана`);
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

export const refuseDelivery = async (
  setLoading,
  token,
  delivery_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/deliveries/refuse`,
      {},
      {
        params: {
          delivery_id,
        },
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success(`Вы успешно отказались от доставки`);
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
