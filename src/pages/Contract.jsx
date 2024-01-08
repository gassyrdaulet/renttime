import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { getFormattedContent } from "../service/DocumentService";
import { generatePDF } from "../service/DocumentService";
import { getContract, sendCode, confirmCode } from "../api/PublicApi";
import Loading from "../components/Loading";
import MyButton from "../components/MyButton";
import Modal from "../components/Modal";
import MyInput from "../components/MyInput";
import styled from "styled-components";
import BlueLinkButton from "../components/BlueLinkButton";
import config from "../config/config.json";
import QRCode from "qrcode-generator";
import {
  BiCheckCircle,
  BiMessageAlt,
  BiPen,
  BiPlusCircle,
} from "react-icons/bi";

const { DOMEN, SIGN_TYPES } = config;

const ContractPageWrapper = styled.div`
  display: block;
  width: 100%;
  background-color: #525659;
`;
const ContractContainer = styled.div`
  display: block;
  padding: 20px;
  overflow: auto;
  width: 100%;
  min-height: 100vh;
`;
const ContractPage = styled.div`
  overflow: hidden;
  display: block;
  margin: 0 auto;
  width: ${(props) => props.style?.pageWidth}px;
  min-height: ${(props) => props.style?.pageHeight}px;
  padding-bottom: ${(props) => {
    return props.style?.pagePadding;
  }}px;
  background-color: white;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
`;
const ContractRow = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
  margin-bottom: ${(props) => props.style?.bottomMargin}px;
`;
const ContractItem = styled.div`
  position: ${(props) => (props.style?.hidden ? "static" : "absolute")};
  opacity: ${(props) => (props.style?.hidden ? "0" : "1")};
  pointer-events: ${(props) => (props.style?.hidden ? "none" : "all")};
  left: ${(props) => props.style?.textLeft}px;
  font-size: ${(props) => props.style?.textSize}px;
  font-weight: ${(props) => props.style?.textWeight};
  width: ${(props) => props.style?.textWidth}px;
  min-width: ${(props) => props.style?.textWidth}px;
  color: ${(props) => props.style?.textColor};
  transform: ${(props) =>
    props.style?.textCenterAlign ? "translateX(-50%)" : ""};
  text-align: ${(props) => (props.style?.textCenterAlign ? "center" : "")};
  text-align: ${(props) => (props.style?.textFillAlign ? "justify" : "")};
  font-family: ${(props) => props.style?.pageFont}, serif;
  max-height: ${(props) => props.style?.textHeight};
  padding-bottom: 1.5px;
`;
const ContractItemTable = styled.table`
  position: ${(props) => (props.style?.hidden ? "static" : "absolute")};
  opacity: ${(props) => (props.style?.hidden ? "0" : "1")};
  pointer-events: ${(props) => (props.style?.hidden ? "none" : "all")};
  left: ${(props) => props.style?.tableLeft}px;
  font-size: ${(props) => props.style?.textSize}px;
  font-weight: ${(props) => props.style?.textWeight};
  width: ${(props) => props.style?.tableWidth}px;
  color: ${(props) => props.style?.textColor};
  border-collapse: collapse;
`;
const ContractItemQR = styled.div`
  display: flex;
  position: ${(props) => (props.style?.hidden ? "static" : "absolute")};
  opacity: ${(props) => (props.style?.hidden ? "0" : "1")};
  pointer-events: ${(props) => (props.style?.hidden ? "none" : "all")};
  left: ${(props) => props.style?.itemLeft}px;
  min-width: ${(props) => props.style?.itemWidth}px;
  max-width: ${(props) => props.style?.itemWidth}px;
  height: 55px;
  max-height: 55px;
  & > * {
    margin-right: 5px;
  }
`;
const ContractItemTableHeaderDigit = styled.th`
  width: ${(props) => props.style?.cellWidth}px;
  font-family: ${(props) => props.style?.pageFont};
  border: ${(props) => props.style?.tableBorder};
  padding: 5px;
`;
const ContractItemTableBodyDigit = styled.td`
  text-align: ${(props) => props.style?.alignCenter && "center"};
  font-family: ${(props) => props.style?.pageFont};
  border: ${(props) => props.style?.tableBorder};
  padding: 5px;
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
  const [orgData, setOrgData] = useState({});
  const [actTemplate, setActTemplate] = useState({});
  const [contractTemplate, setContractTemplate] = useState({});
  const [actContent, setActContent] = useState([]);
  const [contractContent, setContractContent] = useState([]);
  const actRef = useRef();
  const contractRef = useRef();

  const getContractCallback = useCallback(() => {
    if (frozenParams) {
      getContract(
        setContractDataLoading,
        frozenParams.organization_id,
        frozenParams.order_id,
        frozenParams.contract_code,
        setOrgData,
        setOrderData,
        setContractTemplate,
        setActTemplate
      );
    }
  }, [frozenParams]);

  useEffect(() => {
    getContractCallback();
  }, [getContractCallback]);

  useEffect(() => {
    if (actTemplate && contractTemplate) {
      if (
        Object.keys(actTemplate).length !== 0 &&
        Object.keys(contractTemplate).length !== 0
      ) {
        getFormattedContent(
          orderData,
          orgData,
          contractTemplate,
          setActContent
        );
        getFormattedContent(
          orderData,
          orgData,
          actTemplate,
          setContractContent
        );
      }
    }
  }, [actTemplate, contractTemplate, orderData, orgData]);

  useEffect(() => {
    if (
      orderData &&
      Object.keys(orderData).length !== 0 &&
      orderData.sign_type === "remote"
    ) {
      if (orderData.signed) {
        const qrLink = QRCode(0, "H");
        qrLink.addData(
          `${DOMEN}/contract/${params.organization_id}/${params.order_id}/${params.contract_code}`
        );
        qrLink.make();
        const qrClientData = QRCode(0, "L");
        const clientData = {
          iin: orderData.client_paper_person_id,
          sign_date: orderData.sign_date,
          sms_date: orderData.last_sign_sms,
          sms_id: orderData.sign_date,
          serial_no: orderData.client_paper_serial_number,
          client_cp: orderData.client_cellphone,
        };
        qrClientData.addData(JSON.stringify(clientData));
        qrClientData.make();
        const qrLinkSvg = qrLink.createSvgTag({ margin: 0, scalable: true });
        const qrClientDataSvg = qrClientData.createSvgTag({
          margin: 0,
          scalable: true,
        });
        const elements = document.getElementsByName("qrcodeclient");
        for (let element of elements) {
          if (element) {
            element.innerHTML = qrLinkSvg + qrClientDataSvg;
          }
        }
      }
    }
  }, [
    orderData,
    contractContent,
    actContent,
    params.contract_code,
    params.order_id,
    params.organization_id,
  ]);

  useEffect(() => {
    if (orderData && Object.keys(orderData).length !== 0) {
      const qrLink = QRCode(0, "H");
      qrLink.addData(
        `${DOMEN}/contract/${params.organization_id}/${params.order_id}/${params.contract_code}`
      );
      qrLink.make();
      const qrOrgData = QRCode(0, "L");
      const orgQrData = {
        bin: orgData.kz_paper_bin,
        sign_date: orderData.order_created_date,
        org_cp: orderData.cellphone,
      };
      qrOrgData.addData(JSON.stringify(orgQrData));
      qrOrgData.make();
      const qrLinkSvg = qrLink.createSvgTag({ margin: 0, scalable: true });
      const qrClientDataSvg = qrOrgData.createSvgTag({
        margin: 0,
        scalable: true,
      });
      const elements = document.getElementsByName("qrcodeorg");
      for (let element of elements) {
        if (element) {
          element.innerHTML = qrLinkSvg + qrClientDataSvg;
        }
      }
    }
  }, [
    orderData,
    orgData,
    contractContent,
    actContent,
    params.contract_code,
    params.order_id,
    params.organization_id,
  ]);

  const getContractPDF = useCallback(async () => {
    const contractPdf = await generatePDF(
      contractRef,
      contractTemplate.width,
      contractTemplate.height
    );
    var blob = contractPdf.output("blob");
    window.open(URL.createObjectURL(blob));
  }, [contractRef, contractTemplate]);

  const getActPDF = useCallback(async () => {
    const actPdf = await generatePDF(
      actRef,
      actTemplate.width,
      actTemplate.height
    );
    var blob = actPdf.output("blob");
    window.open(URL.createObjectURL(blob));
  }, [actRef, actTemplate]);

  return (
    <ContractPageWrapper>
      {Object.keys(contractTemplate).length !== 0 &&
        Object.keys(actTemplate).length !== 0 && (
          <CenterContainer>
            <GrayWrapper>
              <Text>
                Вы находитесь на странице договора заказа аренды №
                {orderData.order_id}
              </Text>
              <Text>
                Если Вы являетесь арендатором, пожалуйста, прочтите условия
                договора и ознакомьтесь с ним. Далее, если вы согласны, то
                нажмите кнопку «Подтвердить согласие» в самом низу этой
                страницы.
              </Text>
              <Text>
                В случае если вас не устраивают эти условия, вы можете покинуть
                эту страницу и договор не будет считаться действительным.
              </Text>
              <ButtonsContainer>
                <MyButton
                  text="Скачать ДОГОВОР"
                  onClick={getContractPDF}
                  disabled={contractDataLoading}
                  margin="0 10px 0 0"
                />
                <MyButton
                  text="Скачать АКТ"
                  onClick={getActPDF}
                  disabled={contractDataLoading}
                  margin="0"
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
      ) : Object.keys(contractTemplate).length !== 0 &&
        Object.keys(actTemplate).length !== 0 ? (
        <ContractContainer>
          <ContractPage
            ref={contractRef}
            style={{
              pageWidth: contractTemplate?.width,
              pageHeight: contractTemplate?.height,
              pagePadding: contractTemplate?.padding,
            }}
          >
            {actContent.map((dataRow, i) => (
              <ContractRow key={i} style={dataRow.style}>
                {dataRow.rowItems.map((dataItem, i) => {
                  if (dataItem.type === "qrclient") {
                    return (
                      <ContractItemQR
                        name="qrcodeclient"
                        key={i}
                        style={{ ...dataItem.style, hidden: dataItem.hidden }}
                      />
                    );
                  }
                  if (dataItem.type === "qrorg") {
                    return (
                      <ContractItemQR
                        name="qrcodeorg"
                        key={i}
                        style={{ ...dataItem.style, hidden: dataItem.hidden }}
                      />
                    );
                  }
                  if (dataItem.type === "table") {
                    if (dataItem?.table?.length === 0) {
                      return "";
                    }
                    return (
                      <ContractItemTable
                        key={i}
                        style={{ ...dataItem.style, hidden: dataItem.hidden }}
                      >
                        <thead>
                          <tr>
                            {dataItem.table[0].map((headerItem, i) => (
                              <ContractItemTableHeaderDigit
                                key={i}
                                style={{
                                  ...headerItem.style,
                                  pageFont: contractTemplate.font,
                                  tableBorder: dataItem?.style?.tableBorder,
                                }}
                              >
                                {headerItem.value}
                              </ContractItemTableHeaderDigit>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dataItem.table
                            .slice(1, dataItem.length)
                            .map((row, i) => (
                              <tr key={i}>
                                {row.map((rowItem, i) => (
                                  <ContractItemTableBodyDigit
                                    style={{
                                      ...rowItem.style,
                                      pageFont: contractTemplate.font,
                                      tableBorder: dataItem?.style?.tableBorder,
                                    }}
                                    key={i}
                                  >
                                    {rowItem.value}
                                  </ContractItemTableBodyDigit>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </ContractItemTable>
                    );
                  }
                  return (
                    <ContractItem
                      key={i}
                      style={{
                        ...dataItem.style,
                        pageFont: contractTemplate.font,
                        hidden: dataItem.hidden,
                      }}
                    >
                      {dataItem.text}
                    </ContractItem>
                  );
                })}
              </ContractRow>
            ))}
          </ContractPage>
          <ContractPage
            ref={actRef}
            style={{
              pageWidth: actTemplate?.width,
              pageHeight: actTemplate?.height,
              pagePadding: actTemplate?.padding,
            }}
          >
            {contractContent.map((dataRow, i) => (
              <ContractRow key={i} style={dataRow.style}>
                {dataRow.rowItems.map((dataItem, i) => {
                  if (dataItem.type === "qrclient") {
                    return (
                      <ContractItemQR
                        name="qrcodeclient"
                        key={i}
                        style={{ ...dataItem.style, hidden: dataItem.hidden }}
                      />
                    );
                  }
                  if (dataItem.type === "qrorg") {
                    return (
                      <ContractItemQR
                        name="qrcodeorg"
                        key={i}
                        style={{ ...dataItem.style, hidden: dataItem.hidden }}
                      />
                    );
                  }
                  if (dataItem.type === "table") {
                    if (dataItem?.table?.length === 0) {
                      return "";
                    }
                    return (
                      <ContractItemTable
                        key={i}
                        style={{ ...dataItem.style, hidden: dataItem.hidden }}
                      >
                        <thead>
                          <tr>
                            {dataItem.table[0].map((headerItem, i) => (
                              <ContractItemTableHeaderDigit
                                key={i}
                                style={{
                                  ...headerItem.style,
                                  pageFont: actTemplate.font,
                                  tableBorder: dataItem?.style?.tableBorder,
                                }}
                              >
                                {headerItem.value}
                              </ContractItemTableHeaderDigit>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dataItem.table
                            .slice(1, dataItem.length)
                            .map((row, i) => (
                              <tr key={i}>
                                {row.map((rowItem, i) => (
                                  <ContractItemTableBodyDigit
                                    style={{
                                      ...rowItem.style,
                                      pageFont: actTemplate.font,
                                      tableBorder: dataItem?.style?.tableBorder,
                                    }}
                                    key={i}
                                  >
                                    {rowItem.value}
                                  </ContractItemTableBodyDigit>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </ContractItemTable>
                    );
                  }
                  return (
                    <ContractItem
                      key={i}
                      style={{
                        ...dataItem.style,
                        pageFont: actTemplate.font,
                        hidden: dataItem.hidden,
                      }}
                    >
                      {dataItem.text}
                    </ContractItem>
                  );
                })}
              </ContractRow>
            ))}
          </ContractPage>
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
