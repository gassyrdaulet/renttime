import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { getClientByIdKZ } from "../api/ClientApi";
import Loading from "./Loading";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";
import moment from "moment";
import FormLayout from "./FormLayout";
import Modal from "./Modal";
import MyButton from "./MyButton";
import { getDebts } from "../api/GDBApi";
import TableLayout from "./TableLayout";

const { PAPER_AUTHORITY } = config;

const ClientInfoWrapper = styled.div`
  display: block;
  padding: 10px;
  border: ${(props) =>
    props.style?.infoBorder ? props.style.infoBorder : "1px solid #ffd700"};
  border-radius: 5px;
  margin: 10px 0;
`;
const ClientInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ClientInfoHalf = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;
const ClientName = styled.p`
  user-select: none;
  font-size: 16px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
  font-weight: 600;
`;
const ClientInfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;
const ClientInfoTitle = styled.p`
  font-size: 12px;
  color: #a0a0a0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
  margin-right: 5px;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;
const ClientInfoText = styled.p`
  font-size: 16px;
  color: ${(props) => props.style?.color};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

function ClientInfo({
  selectedClientInfo,
  setSelectedClientInfo,
  selectedClient,
}) {
  const [clientInfoLoading, setClientInfoLoading] = useState(false);
  const [asisoipViolations, setAisoipViolations] = useState([]);
  const [asisoipViolationsModal, setAisoipViolationsModal] = useState(false);
  const { token } = useAuth();

  const clientInfoFormattedFirst = useMemo(
    () => [
      {
        id: "id",
        title: "ID клиента",
        value: selectedClientInfo?.id,
      },
      {
        id: "cellphone",
        title: "Телефон",
        value: selectedClientInfo?.cellphone,
      },
      {
        id: "email",
        title: "Эл. почта",
        value: selectedClientInfo?.email,
      },
      {
        id: "orders_count",
        title: "Количество заказов",
        value: selectedClientInfo?.orders_count,
      },
    ],
    [selectedClientInfo]
  );
  const clientInfoFormattedSecond = useMemo(
    () => [
      {
        id: "paper_person_id",
        title: "ИИН",
        value: selectedClientInfo?.paper_person_id,
      },
      {
        id: "paper_serial_number",
        title: "Номер документа",
        value: selectedClientInfo?.paper_serial_number,
      },
      {
        id: "paper_authority",
        title: "Кем выдано",
        value: PAPER_AUTHORITY?.[selectedClientInfo?.paper_authority],
      },
      {
        id: "paper_givendate",
        title: "Дата выдачи",
        value:
          moment(selectedClientInfo?.paper_givendate).isValid() &&
          moment(selectedClientInfo?.paper_givendate).format("DD.MM.yyyy"),
      },
    ],
    [selectedClientInfo]
  );
  const clientNameFormatted = useMemo(() => {
    const nameKeys = ["second_name", "name", "father_name"];
    let string = "";
    for (let key of nameKeys) {
      if (selectedClientInfo?.[key]) {
        string += selectedClientInfo[key] + " ";
      }
    }
    if (!string) {
      return "Клиент не выбран";
    }
    return string;
  }, [selectedClientInfo]);

  const aisoipHeaders = useMemo(
    () => [
      {
        id: "index",
        style: {
          fixedMinWidth: "40px",
          fixedJustWidth: "40px",
          fixedMaxWidth: "40px",
        },
        title: "№",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "ipDate",
        style: {
          fixedMinWidth: "130px",
          fixedJustWidth: "130px",
          fixedMaxWidth: "130px",
        },
        title: "Дата исполнительного производства",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "disa",
        style: {
          fixedMinWidth: "140px",
          fixedJustWidth: "140px",
          fixedMaxWidth: "140px",
        },
        title: "Орган исполнительного пр-ва | Судебный исполнитель",
        type: "text",
      },
      {
        id: "ilOrgan",
        style: {
          fixedMinWidth: "130px",
          fixedJustWidth: "130px",
          fixedMaxWidth: "130px",
        },
        title: "Орган выдавший документ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "recoveryAmount",
        style: {
          fixedMinWidth: "120px",
          fixedJustWidth: "120px",
          fixedMaxWidth: "120px",
        },
        title: "Сумма долга",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
    ],
    []
  );

  const aisoipData = useMemo(
    () =>
      asisoipViolations.map((item, i) => ({
        id: item.execProc,
        index: i + 1,
        ipDate: moment(item.ipStartDate).format("DD.MM.YYYY"),
        disa: `${item?.disaDepartmentNameRu}, ${item?.officerSurname} ${item?.officerName}`,
        ilOrgan: item?.ilOrganRu,
        recoveryAmount: item?.recoveryAmount,
      })),
    [asisoipViolations]
  );

  useEffect(() => {
    if (token && selectedClient) {
      getClientByIdKZ(
        setClientInfoLoading,
        token,
        setSelectedClientInfo,
        selectedClient.id,
        (data) => {
          getDebts(() => {}, token, data.paper_person_id, setAisoipViolations);
        }
      );
    }
  }, [selectedClient, token, setSelectedClientInfo]);

  useEffect(() => {
    if (!selectedClient) {
      setSelectedClientInfo({});
    }
  }, [selectedClient, setSelectedClientInfo]);

  return (
    <ClientInfoWrapper
      style={{ infoBorder: asisoipViolations.length > 0 && "1px solid red" }}
    >
      <ClientName>
        {clientInfoLoading ? "Загрузка..." : clientNameFormatted}
      </ClientName>
      {clientInfoLoading ? (
        <div className="LoadingWrapper1">
          <Loading which="gray" />
        </div>
      ) : (
        selectedClient && (
          <ClientInfoContainer>
            <ClientInfoHalf>
              {clientInfoFormattedFirst.map((item) => (
                <ClientInfoRow key={item.id}>
                  <ClientInfoTitle>{item.title}:</ClientInfoTitle>
                  <ClientInfoText>
                    {item.value ? item.value : " - "}
                  </ClientInfoText>
                </ClientInfoRow>
              ))}
            </ClientInfoHalf>
            <ClientInfoHalf>
              {clientInfoFormattedSecond.map((item) => (
                <ClientInfoRow key={item.id}>
                  <ClientInfoTitle>{item.title}:</ClientInfoTitle>
                  <ClientInfoText>
                    {item.value ? item.value : " - "}
                  </ClientInfoText>
                </ClientInfoRow>
              ))}
            </ClientInfoHalf>
          </ClientInfoContainer>
        )
      )}
      {asisoipViolations.length > 0 && (
        <ClientInfoContainer>
          <MyButton
            text={"ОБНАРУЖЕНЫ записи в РЕЕСТРЕ ДОЛЖНИКОВ".toLocaleUpperCase()}
            onClick={() => setAisoipViolationsModal(true)}
            disabled={clientInfoLoading}
            color={{ default: "#c8649d", dark: "#98346d" }}
            margin="10px 0 8px 0"
          />
        </ClientInfoContainer>
      )}
      <Modal
        setModalVisible={setAisoipViolationsModal}
        modalVisible={asisoipViolationsModal}
        title={`Реестр должников (${asisoipViolations.length} записей)`}
      >
        <FormLayout
          mobileMaxWidth="95%"
          firstHalf={
            <div>
              <TableLayout headers={aisoipHeaders} data={aisoipData} />
            </div>
          }
          buttons={[]}
        />
      </Modal>
    </ClientInfoWrapper>
  );
}

export default ClientInfo;
