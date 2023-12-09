import { axiosNT } from "./Axios";
import { toast } from "react-toastify";

export const getContract = async (
  setLoading,
  organization_id,
  order_id,
  contract_code,
  setOrgData,
  setOrderData,
  setContractTemplate,
  setActTemplate
) => {
  setLoading(true);
  axiosNT
    .get(`/api/public/getcontract`, {
      params: { organization_id, order_id, contract_code },
    })
    .then(({ data }) => {
      setOrgData(data.organization_data);
      setOrderData(data.order_data);
      setContractTemplate(data.contractTemplate);
      setActTemplate(data.actTemplate);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      setOrgData({});
      setOrderData({});
      setContractTemplate({});
      setActTemplate({});
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const sendCode = async (
  setLoading,
  organization_id,
  order_id,
  contract_code
) => {
  setLoading(true);
  axiosNT
    .get(`/api/public/sendcode`, {
      params: { organization_id, order_id, contract_code },
    })
    .then(() => {
      toast.success("СМС код успешно отправлен", { draggable: false });
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};

export const confirmCode = async (
  setLoading,
  organization_id,
  order_id,
  contract_code,
  sign_code
) => {
  setLoading(true);
  axiosNT
    .get(`/api/public/confirmcode`, {
      params: { organization_id, order_id, contract_code, sign_code },
    })
    .then(() => {
      toast.success("Код абсолютно верен!", { draggable: false });
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setLoading(false);
    });
};
