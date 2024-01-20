import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { sendCode, confirmCode, getDocx } from "../api/PublicApi";
import Loading from "../components/Loading";
import MyButton from "../components/MyButton";
import Modal from "../components/Modal";
import MyInput from "../components/MyInput";
import styled from "styled-components";
import BlueLinkButton from "../components/BlueLinkButton";
import config from "../config/config.json";
import {
  BiCheckCircle,
  BiMessageAlt,
  BiPen,
  BiPlusCircle,
} from "react-icons/bi";

const { SIGN_TYPES } = config;

const ContractPageWrapper = styled.div`
  display: block;
  width: 100%;
  background-color: #525659;
`;
const ContractContainer = styled.div`
  display: block;
  padding: 20px;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
`;
const CenterContainer = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  max-width: 500px;
  padding: 20px 8px 50px 8px;
`;
const GrayWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
`;
const ConfirmContractWrapper = styled.div`
  width: 85vw;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CenterText = styled.p`
  text-align: center;
  user-select: none;
`;
const Text = styled.p`
  width: 100%;
  text-align: justify;
  user-select: none;
  margin-bottom: 10px;
`;
const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  & > * {
    width: 100%;
  }
`;
const StatusWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid gray;
`;
const StatusText = styled.div`
  display: flex;
  user-select: none;
  align-items: center;
  font-size: 12px;
`;

function Contract() {
  const params = useParams();
  const [confirmContractModal, setConfirmContractModal] = useState(false);
  const [code, setCode] = useState("");
  const [frozenParams] = useState(params);
  const [contractDataLoading, setContractDataLoading] = useState(false);
  const [confrimLoading, setConfirmLoading] = useState(false);
  const [sendSMSLoading, setSendSMSLoading] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [doc, setDoc] = useState();

  const getContractCallback = useCallback(() => {
    if (frozenParams) {
      getDocx(
        setContractDataLoading,
        frozenParams.organization_id,
        frozenParams.order_id,
        frozenParams.contract_code,
        setDoc,
        setOrderData
      );
    }
  }, [frozenParams]);

  useEffect(() => {
    getContractCallback();
  }, [getContractCallback]);

  return (
    <ContractPageWrapper>
      {doc && (
        <CenterContainer>
          <GrayWrapper>
            <Text>
              Вы находитесь на странице договора заказа аренды №
              {frozenParams.order_id}
            </Text>
            <Text>
              Если Вы являетесь арендатором, пожалуйста, прочтите условия
              договора и ознакомьтесь с ним. Далее, если вы согласны, то нажмите
              кнопку «Подтвердить согласие» в самом низу этой страницы.
            </Text>
            <Text>
              В случае если вас не устраивают эти условия, вы можете покинуть
              эту страницу и договор не будет считаться действительным.
            </Text>
            <ButtonsContainer>
              <MyButton
                text="Скачать документ"
                onClick={() => {
                  window.open(doc);
                }}
                disabled={contractDataLoading}
                margin="0 10px 0 0"
              />
            </ButtonsContainer>
            <Text>История заказа:</Text>
            <StatusWrapper>
              <StatusText>
                <BiPlusCircle />
                <p>Договор создан</p>
              </StatusText>
              {orderData.order_created_date}
            </StatusWrapper>
            <StatusWrapper>
              <StatusText>
                <BiMessageAlt />
                <p>Сообщение с кодом отправлено</p>
              </StatusText>
              {orderData.last_sign_sms === "Invalid date"
                ? "-"
                : orderData.last_sign_sms}
            </StatusWrapper>
            <StatusWrapper>
              <StatusText>
                <BiCheckCircle />
                <p>Договор подписан клиентом</p>
              </StatusText>
              {orderData.signed ? orderData.sign_date : "НЕТ"}
            </StatusWrapper>
            {orderData.signed && (
              <StatusWrapper>
                <StatusText>
                  <BiPen />
                  <p>Тип подписи</p>
                </StatusText>
                {SIGN_TYPES[orderData.sign_type]}
              </StatusWrapper>
            )}
            <StatusWrapper>
              <StatusText>
                <BiCheckCircle />
                <p>Договор рассторгнут</p>
              </StatusText>
              {orderData.finished_date !== "Invalid date"
                ? orderData.finished_date
                : "НЕТ"}
            </StatusWrapper>
          </GrayWrapper>
        </CenterContainer>
      )}
      {contractDataLoading ? (
        <div className="Center">
          <GrayWrapper>
            <Loading />
            Загрузка договора...
          </GrayWrapper>
        </div>
      ) : doc ? (
        <ContractContainer>
          <iframe
            title="Document"
            width="100%"
            height="100%"
            src={`https://docs.google.com/gview?url=${doc}&embedded=true`}
          />
        </ContractContainer>
      ) : (
        <div className="Center">
          <GrayWrapper>Договор не найден</GrayWrapper>
        </div>
      )}
      <CenterContainer>
        <MyButton
          text="Подтвердить согласие"
          onClick={() => {
            // sendCode(
            //   setConfirmLoading,
            //   frozenParams.organization_id,
            //   frozenParams.order_id,
            //   frozenParams.contract_code
            // );
            setConfirmContractModal(true);
          }}
          disabled={contractDataLoading || orderData.signed}
          color={{ default: "#85c442", dark: "#7ab835" }}
          margin="0 0 10px 0"
        />
      </CenterContainer>
      <Modal
        setModalVisible={setConfirmContractModal}
        modalVisible={confirmContractModal}
        noEscape={confrimLoading}
        title="Подтвердите согласие"
        onlyByClose={true}
      >
        <ConfirmContractWrapper>
          <CenterText>1. Нажмите на кнопку отправить код</CenterText>
          <BlueLinkButton
            text="Отправить СМС код"
            disabled={sendSMSLoading || confrimLoading}
            onClick={(e) => {
              e.preventDefault();
              sendCode(
                setSendSMSLoading,
                frozenParams.organization_id,
                frozenParams.order_id,
                frozenParams.contract_code
              );
            }}
          />
          <CenterText>
            2. Затем подтвердите код, высланный вам по СМС на номер{" "}
            {orderData.client_cellphone}
          </CenterText>
          <MyInput
            label="Код *"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={confrimLoading}
            inputMode="numeric"
          />

          <MyButton
            text="Подтвердить"
            onClick={() => {
              confirmCode(
                setConfirmLoading,
                frozenParams.organization_id,
                frozenParams.order_id,
                frozenParams.contract_code,
                code,
                () => {
                  setConfirmContractModal(false);
                  getContractCallback();
                }
              );
            }}
            disabled={confrimLoading || code.length !== 6}
            loading={String(confrimLoading)}
            margin="20px 0 0 0"
          />
        </ConfirmContractWrapper>
      </Modal>
    </ContractPageWrapper>
  );
}

export default Contract;
