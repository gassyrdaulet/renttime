import ContainerLayout from "../components/ContainerLayout";
import { useState, useMemo, useEffect, useCallback } from "react";
import InputsLayout from "../components/InputsLayout";
import { getIncomeData } from "../api/OrganizationApi";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import config from "../config/config.json";
import moment from "moment";
import InfoRows from "../components/InfoRows";
import TableLayout from "../components/TableLayout";
import styled from "styled-components";

const { CURRENCIES } = config;

const SummaryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TotalInfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

function IncomeSummary() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const { token, currency } = useAuth();

  const fetch = useCallback(
    (first_date, second_date) => {
      getIncomeData(setIsLoading, { first_date, second_date }, token, setData);
    },
    [token]
  );

  useEffect(() => {
    fetch(
      moment().startOf("month").toDate().toISOString(),
      moment().toDate().toISOString()
    );
  }, [fetch]);

  const inputs = useMemo(
    () => [
      [
        [
          [
            {
              id: "from",
              type: "date",
              value: moment().startOf("month").format("YYYY-MM-DD"),
              label: "От",
              calendar: false,
            },
          ],
          [
            {
              id: "till",
              type: "date",
              value: moment().format("YYYY-MM-DD"),
              label: "До",
              calendar: false,
            },
          ],
        ],
      ],
    ],
    []
  );

  const buttons = useMemo(() => {
    return [
      {
        id: 1,
        text: "Применить",
        onClick: (data) => {
          if (data.from && data.till) {
            fetch(data.from.toISOString(), data.till.toISOString());
          }
        },
      },
    ];
  }, [fetch]);

  const headers = useMemo(() => {
    return [
      {
        id: "method",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "СПОСОБ ОПЛАТЫ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "sum",
        style: {
          fixedMinWidth: "120px",
          fixedJustWidth: "120px",
          fixedMaxWidth: "120px",
        },
        title: "СУММА",
        type: "text",
      },
      {
        id: "comission",
        style: {
          fixedMinWidth: "120px",
          fixedJustWidth: "120px",
          fixedMaxWidth: "120px",
        },
        dataStyle: { dataAlign: "center" },
        title: "КОМИССИЯ",
        type: "text",
      },
    ];
  }, []);

  const paymentsSum = useMemo(() => {
    if (!data) return 0;
    return data.payments.reduce((sum, item) => {
      if (item.verified) {
        return sum + item.amount;
      } else return sum;
    }, 0);
  }, [data]);

  const debtsSum = useMemo(() => {
    if (!data) return 0;
    return data.debts.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);
  }, [data]);

  const deliveriesSum = useMemo(() => {
    if (!data) return 0;
    return data.deliveries.reduce((sum, item) => {
      return sum + item.delivery_price_for_courier;
    }, 0);
  }, [data]);

  const leftContent = (
    <div>
      <InputsLayout
        width="100%"
        height="inherit"
        maxHeight="inherit"
        inputs={inputs}
        buttons={buttons}
        disabled={isLoading}
      />
      <InfoRows
        infoRows={[{ type: "partTitle", value: `Всего заказов` }]}
        margin="0"
      />
    </div>
  );
  const mainContent = (
    <SummaryContainer>
      <TotalInfoContainer>
        <InfoRows
          align="center"
          infoRows={[
            { type: "rowBigTitle", value: `Сумма принятой оплаты` },
            {
              type: "rowValue",
              value: `${paymentsSum} ${CURRENCIES[currency]}`,
            },
          ]}
          margin="0"
        />
        <InfoRows
          align="center"
          infoRows={[
            { type: "rowBigTitle", value: `Количество продлений` },
            {
              type: "rowValue",
              value: `${data?.extensions ? data?.extensions.length : 0}`,
            },
          ]}
          margin="0"
        />
        <InfoRows
          align="center"
          infoRows={[
            { type: "rowBigTitle", value: `Принятые долги` },
            {
              type: "rowValue",
              value: `${debtsSum} ${CURRENCIES[currency]}`,
            },
          ]}
          margin="0"
        />
        <InfoRows
          align="center"
          infoRows={[
            { type: "rowBigTitle", value: `Сумма оплаты доставок` },
            {
              type: "rowValue",
              value: `${deliveriesSum} ${CURRENCIES[currency]}`,
            },
          ]}
          margin="0"
        />
      </TotalInfoContainer>
      <TableLayout headers={headers} />
    </SummaryContainer>
  );

  return (
    <ContainerLayout
      searchButtonLoading={() => {}}
      leftContent={leftContent}
      mainContent={
        isLoading ? (
          <div className="LoadingWrapper1">
            <Loading which="gray" />
          </div>
        ) : (
          mainContent
        )
      }
    />
  );
}

export default IncomeSummary;
