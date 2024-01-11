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

export const getAllOrders = async (
  setLoading,
  token,
  setOrders,
  params,
  setFilteredTotalCount = () => {},
  setTotalCount = () => {}
) => {
  setLoading(true);
  axiosNT
    .get(`/api/orders/all`, {
      params,
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      // console.log(data.orders);
      setOrders(data.orders);
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

export const getOrderDetails = async (
  setLoading,
  token,
  setOrderInfo,
  order_id
) => {
  setLoading(true);
  axiosNT
    .get(`/api/orders/details`, {
      params: { order_id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(({ data }) => {
      // console.log(data);
      setOrderInfo(data);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const newPayment = async (
  setLoading,
  token,
  order_id,
  paymentInfo,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/newpayment`,
      { order_id, ...paymentInfo },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Новая оплата успешно принята", { draggable: false });
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

export const newPaymentForCourier = async (
  setLoading,
  token,
  order_id,
  paymentInfo,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/newpaymentcourier`,
      { order_id, ...paymentInfo },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Новая оплата для курьера успешно запланирована", {
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

export const newExtension = async (
  setLoading,
  token,
  order_id,
  extensionInfo,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/newextension`,
      { order_id, ...extensionInfo },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Новое продление успешно принято", { draggable: false });
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

export const newDiscount = async (
  setLoading,
  token,
  order_id,
  discountInfo,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/newdiscount`,
      { order_id, ...discountInfo },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Новая скидка успешно добавлена", { draggable: false });
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

export const newViolation = async (
  setLoading,
  token,
  body,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(`/api/orders/newviolation`, body, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Новое нарушение успешно добавлено", { draggable: false });
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

export const finishOrder = async (
  setLoading,
  token,
  order_id,
  is_debt,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/finishorder`,
      { order_id, is_debt },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Заказ успешно завершен", { draggable: false });
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

export const cancelOrder = async (
  setLoading,
  token,
  order_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/cancelorder`,
      { order_id },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Заказ успешно отменен", { draggable: false });
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

export const sendLink = async (
  setLoading,
  token,
  order_id,
  link_code,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/sendlink`,
      {
        order_id,
        link_code,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("СМС ссылка успешно отправлена", { draggable: false });
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

export const signPhysical = async (
  setLoading,
  token,
  order_id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .post(
      `/api/orders/signphysical`,
      {},
      {
        params: { order_id },
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(() => {
      toast.success("Физическая подпись успешно получена", {
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

export const deleteExtension = async (
  setLoading,
  token,
  id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .delete(`/api/orders/deleteextension`, {
      params: { id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Продление успешно удалено", { draggable: false });
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

export const deleteDiscount = async (
  setLoading,
  token,
  id,
  next = () => {}
) => {
  setLoading(true);
  axiosNT
    .delete(`/api/orders/deletediscount`, {
      params: { id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Скидка успешно удалена", { draggable: false });
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

export const deletePayment = async (setLoading, token, id, next = () => {}) => {
  setLoading(true);
  axiosNT
    .delete(`/api/orders/deletepayment`, {
      params: { id },
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      toast.success("Оплата успешно удалена", { draggable: false });
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
