import { useState, useMemo, useCallback } from "react";
import { newOrganization } from "../api/OrganizationApi";
import Modal from "../components/Modal";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import MyInput from "../components/MyInput";
import Select from "../components/Select";
import MyButton from "../components/MyButton";
import styled from "styled-components";
import TimePicker from "../components/TimePicker";
import config from "../config/config.json";

const { COMPANY_TYPES } = config;

const NoOrgWrapper = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const NoOrgContainer = styled.div`
  width: 90vw;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const CreateOrgForm = styled.form`
  width: 90vw;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`;
const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #cccccc;
  height: 60vh;
  overflow-y: auto;
`;
const PickTimeContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const PickTimeContainerHalf = styled.div`
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const NoOrgInfo = styled.p`
  text-align: center;
  user-select: none;
  margin-bottom: 15px;
  margin-top: 15px;
`;
const UserCode = styled.p`
  text-align: center;
  font-size: 25px;
  font-weight: 600;
`;

function NoOrg() {
  const [isLoading, setIsLoading] = useState(false);
  const [newOrgModal, setNewOrgModal] = useState(false);
  const [inputs, setInputs] = useState([
    { id: "city", value: "", title: "Город *", max: 20 },
    { id: "address", value: "", title: "Адрес *", max: 50 },
    {
      id: "bank_company_type",
      value: "NO",
      title: "Тип компании банка *",
      options: COMPANY_TYPES,
      type: "select",
    },
    { id: "bank_company_name", value: "", title: "Название банка *", max: 20 },
    {
      id: "company_type",
      value: "NO",
      title: "Тип вашей компании *",
      options: COMPANY_TYPES,
      type: "select",
    },
    {
      id: "company_name",
      value: "",
      title: "Название вашей компании *",
      max: 20,
    },
    { id: "kz_paper_bin", value: "", title: "БИН *", max: 12 },
    { id: "kz_paper_bik", value: "", title: "БИК *", max: 12 },
    { id: "kz_paper_iik", value: "", title: "ИИК *", max: 20 },
  ]);
  const [orgName, setOrgName] = useState("");
  const [region, setRegion] = useState("null");
  const [startWork, setStartWork] = useState("08:00");
  const [endWork, setEndWork] = useState("20:00");
  const { token } = useAuth();
  const navigate = useNavigate();

  const regionOptions = useMemo(
    () => [
      { id: "null", name: "Не выбран" },
      { id: "kz", name: "Казахстан" },
    ],
    []
  );

  const handleChangeInputs = useCallback((id, v) => {
    setInputs((prev) => {
      const temp = [...prev];
      for (let item of temp) {
        if (item.id === id) {
          item.value = v;
          return temp;
        }
      }
      return temp;
    });
  }, []);

  return (
    <NoOrgWrapper>
      <NoOrgContainer>
        <div className="Window">
          <NoOrgInfo>
            Вы не состоите в какой либо организации. Вы можете войти в
            существующую , или создать новую
          </NoOrgInfo>
          <MyButton
            onClick={() => setNewOrgModal(true)}
            text="Создать новую организацию"
          />
          <NoOrgInfo>
            Для того, чтобы вступить в существующую организацию, Вам необходимо
            связаться с ее администратором и сообщить ему свой код:
          </NoOrgInfo>
          <UserCode>
            {localStorage.getItem("userId") &&
              `«${localStorage.getItem("userId")}»`}
          </UserCode>
        </div>
      </NoOrgContainer>
      <Modal
        onlyByClose={true}
        title="Создание новой организации"
        noEscape={isLoading}
        modalVisible={newOrgModal}
        setModalVisible={setNewOrgModal}
      >
        <CreateOrgForm style={{ display: "flex", flexDirection: "column" }}>
          <InputsContainer>
            <MyInput
              label="Название организации *"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={isLoading}
            />
            <Select
              options={regionOptions}
              loading={isLoading}
              setValue={setRegion}
              value={region}
              label="Выберите регион *"
            />
            {inputs.map((item) => {
              if (item.type) {
                if (item.type === "select") {
                  return (
                    <Select
                      key={item.id}
                      label={item.title}
                      options={item.options}
                      value={item.value}
                      setValue={(v) => handleChangeInputs(item.id, v)}
                    />
                  );
                }
              }
              return (
                <MyInput
                  max={item.max}
                  value={item.value}
                  onChange={(e) => handleChangeInputs(item.id, e.target.value)}
                  key={item.id}
                  label={item.title}
                  disabled={isLoading}
                />
              );
            })}
            <PickTimeContainer>
              <PickTimeContainerHalf>
                <TimePicker
                  time={startWork}
                  setTime={setStartWork}
                  label="Время открытия"
                />
              </PickTimeContainerHalf>
              <PickTimeContainerHalf>
                <TimePicker
                  time={endWork}
                  setTime={setEndWork}
                  label="Время закрытия"
                />
              </PickTimeContainerHalf>
            </PickTimeContainer>
          </InputsContainer>
          <MyButton
            type="submit"
            text="Создать организацию"
            onClick={() => {
              const data = {};
              inputs.forEach((item) => {
                data[item.id] = item.value;
              });
              data.name = orgName;
              data.region = region;
              data.start_work = startWork;
              data.end_work = endWork;
              newOrganization(setIsLoading, token, data, () => navigate(0));
            }}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </CreateOrgForm>
      </Modal>
    </NoOrgWrapper>
  );
}

export default NoOrg;
