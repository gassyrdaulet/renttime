import { useEffect, useState, useMemo, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import ContainerLayout from "../components/ContainerLayout";
import { FaPencilAlt, FaTrashAlt, FaMoneyBill } from "react-icons/fa";
import CredButtons from "../components/CredButtons";
import Loading from "../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import cl from "../styles/Card.module.css";
import { BiSolidChevronLeft } from "react-icons/bi";
import styled from "styled-components";
import moment from "moment";
import InfoRows from "../components/InfoRows";
import { closeDebt, deleteClient, getClientByIdKZ } from "../api/ClientApi";
import config from "../config/config.json";
import HistoryInfoRows from "../components/HistoryInfoRows";
import Modal from "../components/Modal";
import EditClientForm from "../components/EditClientForm";
import CreateDebtForm from "../components/CreateDebtForm";
import useConfirm from "../hooks/useConfirm";
import { getMethods } from "../api/OrganizationApi";
import Select from "../components/Select";

const { GENDERS, PAPER_AUTHORITY, CURRENCIES, SPECIE_STATUSES } = config;

const GoBack = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  user-select: none;
`;
const InfoTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin: 10px;
  user-select: none;
`;

function ClientDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addDebtModal, setAddDebtModal] = useState(false);
  const [data, setData] = useState({});
  const { token, currency } = useAuth();
  const { confirm } = useConfirm();
  const params = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 0, name: "Загрузка..." },
  ]);

  useEffect(() => {
    getMethods(setEditLoading, token, setPaymentMethods);
  }, [token]);

  const options = useMemo(() => {
    const result = paymentMethods.map((item) => ({
      id: item.id,
      name: item.name + (item.comission ? ` (${item.comission}%)` : ""),
    }));
    if (result.length !== 0) {
      setPaymentMethod(result[0].id);
    }
    return result;
  }, [paymentMethods]);

  const credButtons = [
    {
      id: 1,
      title: "Редактировать",
      icon: <FaPencilAlt color="#0F589D" size={20} />,
      onClick: () => setEditModal(true),
      disabled: isLoading,
    },
    {
      id: 2,
      title: "Добавить долг",
      icon: <FaMoneyBill color="#0F9D58" size={20} />,
      onClick: () => setAddDebtModal(true),
      disabled: isLoading,
    },
    {
      id: 5,
      title: "Удалить",
      icon: <FaTrashAlt color="#dd580f" size={20} />,
      onClick: async () => {
        if (await confirm("Вы уверены?")) {
          return deleteClient(setIsLoading, token, params.id, () => {
            navigate(`/clients/${params.page}`);
          });
        }
      },
      disabled: isLoading,
    },
  ];

  const fetchData = useCallback(() => {
    getClientByIdKZ(setIsLoading, token, setData, params.id);
  }, [token, params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const infoRows = useMemo(
    () => [
      { value: "Информация о клиенте", type: "partTitle" },
      { value: "ФИО", type: "rowTitle" },
      {
        value: `${data.second_name} ${data.name} ${
          data.father_name ? data.father_name : ""
        }`,
        type: "rowValue",
      },
      { value: "Номер телефона", type: "rowTitle" },
      {
        value: data.cellphone,
        type: "rowValue",
      },
      { value: "Эл. почта", type: "rowTitle" },
      {
        value: data.email,
        type: "rowValue",
      },
      { value: "Город проживания", type: "rowTitle" },
      {
        value: data.city,
        type: "rowValue",
      },
      { value: "Адрес проживания", type: "rowTitle" },
      {
        value: data.address,
        type: "rowValue",
      },
      { value: "ИИН", type: "rowTitle" },
      {
        value: data.paper_person_id,
        type: "rowValue",
      },
      { value: "Номер документа", type: "rowTitle" },
      {
        value: data.paper_serial_number,
        type: "rowValue",
      },
      { value: "Докумен выдан", type: "rowTitle" },
      {
        value: PAPER_AUTHORITY[data.paper_authority],
        type: "rowValue",
      },
      { value: "Дата выдачи документа", type: "rowTitle" },
      {
        value: moment(data.paper_givendate).format("DD.MM.YYYY"),
        type: "rowValue",
      },
      { value: "Пол и возраст", type: "rowTitle" },
      {
        value: `${GENDERS[data?.gender]} ${
          isNaN(
            moment().diff(
              moment(data.paper_person_id?.slice(0, 6), "YYMMDD"),
              "years"
            )
          )
            ? ""
            : ", " +
              moment().diff(
                moment(data.paper_person_id?.slice(0, 6), "YYMMDD"),
                "years"
              )
        }`,
        type: "rowValue",
      },
      { value: "Национальность", type: "rowTitle" },
      {
        value: data.nationality,
        type: "rowValue",
      },
      { value: "Место рождения", type: "rowTitle" },
      {
        value: data.born_region,
        type: "rowValue",
      },
      { value: "Дата регистрации клиента", type: "rowTitle" },
      {
        value: moment(data.created_date).format("DD.MM.YYYY"),
        type: "rowValue",
      },
      { value: "Количество завершенных договоров", type: "rowTitle" },
      {
        value: data.orders_count,
        type: "rowValue",
      },
    ],
    [data]
  );

  const debts = useMemo(
    () =>
      data.debts?.map((debt) => ({
        id: debt.id,
        hoverTitle: `ID: ${debt.userInfo?.id} - ${debt.userInfo?.cellphone}`,
        title: `ID: ${debt.id} - ${moment(debt.date).format(
          "DD.MM.YYYY HH:mm"
        )} - ${debt.userInfo?.name} - ID смены: ${debt.workshift_id}`,
        values: [
          `Сумма: ${debt.amount} ${CURRENCIES[currency]}`,
          `Комментарий: ${debt.comment ? debt.comment : "-"}`,
          `Заказ: ${debt.order_id ? debt.order_id : "-"}`,
          `Закрыт: ${debt.closed ? "ДА" : "НЕТ"}`,
        ],
        buttons: debt.closed
          ? []
          : [
              {
                text: "Закрыть",
                onClick: async () => {
                  if (
                    await confirm(
                      <div>
                        <p>
                          Вы уверены что хотите закрыть этот долг? ID:
                          {debt.id}
                        </p>
                        <Select
                          label="Способ оплаты"
                          value={paymentMethod}
                          setValue={setPaymentMethod}
                          loading={editLoading}
                          defaultOptions={[]}
                          options={options}
                        />
                      </div>
                    )
                  ) {
                    closeDebt(
                      setIsLoading,
                      token,
                      { debt_id: debt.id, payment_method_id: paymentMethod },
                      () => fetchData()
                    );
                  }
                },
              },
            ],
      })),
    [
      data,
      currency,
      confirm,
      fetchData,
      token,
      options,
      editLoading,
      paymentMethod,
    ]
  );

  const debtsSum = useMemo(() => {
    const sum = data.debts?.reduce((accumulator, currentValue) => {
      return currentValue.closed
        ? accumulator
        : accumulator + currentValue.amount;
    }, 0);
    return sum;
  }, [data]);

  const violations = useMemo(
    () =>
      data.violations?.map((violation) => ({
        id: violation.id,
        hoverTitle: `ID: ${violation.userInfo.id} - ${violation.userInfo.cellphone}`,
        title: `ID: ${violation.id} - ${moment(violation.date).format(
          "DD.MM.YYYY HH:mm"
        )} - ${violation.userInfo.name} - ID смены: ${violation.workshift_id}`,
        values: [
          `Тип: ${SPECIE_STATUSES[violation.specie_violation_type]}`,
          `ID Единицы: ${violation.specie_id}`,
          `ID Заказа: ${violation.order_id}`,
          `Комментарий: ${violation.comment ? violation.comment : "-"}`,
        ],
      })),
    [data]
  );

  const leftContent = (
    <div>
      <GoBack onClick={() => navigate(`/clients/${params.page}`)}>
        <div className={cl.IconContainer}>
          <BiSolidChevronLeft size={20} />
        </div>
        <p>Назад ко всем клиентам</p>
      </GoBack>
      <CredButtons credButtons={credButtons} />
    </div>
  );

  const mainContent = (
    <div>
      <InfoTitle>Клиент: {params.id}</InfoTitle>
      <InfoRows infoRows={infoRows} />
      <HistoryInfoRows
        title={`Долги: ${debtsSum} ${CURRENCIES[currency]}`}
        historyRows={debts}
      />
      <HistoryInfoRows
        title="Информация о нарушениях"
        historyRows={violations}
      />
      <Modal
        modalVisible={editModal}
        setModalVisible={setEditModal}
        noEscape={editLoading}
        title="Редактирование клиента"
      >
        <EditClientForm
          isLoading={editLoading}
          setIsLoading={setEditLoading}
          clientId={params.id}
          next={() => {
            setEditModal();
            fetchData();
          }}
        />
      </Modal>
      <Modal
        modalVisible={addDebtModal}
        setModalVisible={setAddDebtModal}
        noEscape={editLoading}
        title="Добавить долг"
      >
        <CreateDebtForm
          isLoading={editLoading}
          setIsLoading={setEditLoading}
          clientId={params.id}
          next={() => {
            setAddDebtModal(false);
            fetchData();
          }}
        />
      </Modal>
    </div>
  );

  return (
    <ContainerLayout
      leftContent={leftContent}
      mainContent={
        isLoading ? (
          <div className="LoadingWrapper2">
            <Loading which="gray" />
          </div>
        ) : (
          mainContent
        )
      }
    />
  );
}

export default ClientDetails;
