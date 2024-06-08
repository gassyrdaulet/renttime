import ContainerLayout from "../components/ContainerLayout";
import { useState, useMemo, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import moment from "moment";
import InfoRows from "../components/InfoRows";
import { MyProgressBar } from "../components/MyProgressBar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { LineChart, ChartsXAxis, ChartsYAxis } from "@mui/x-charts";
import { styled } from "@mui/material/styles";
import {
  FaClipboardList,
  FaShoppingCart,
  FaUsers,
  FaListOl,
} from "react-icons/fa";
import styledComp from "styled-components";
import MyButton from "../components/MyButton";
import { useNavigate } from "react-router-dom";
import { getMainData } from "../api/OrganizationApi";

const dateFormat = "DD.MM.YYYY HH:mm";

const IconWrapper = styledComp.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  & svg {
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
  }
`;

const dataTemplate = {
  totalOrders: {
    icon: <FaClipboardList />,
    title: "Общее количество заказов:",
  },
  totalGoods: {
    icon: <FaShoppingCart />,
    title: "Общее количество товаров:",
  },
  totalSpecies: {
    icon: <FaListOl />,
    title: "Общее количество единиц:",
  },
  totalClients: {
    icon: <FaUsers />,
    title: "Общее количество клиентов:",
  },
};

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Main() {
  const [data, setData] = useState({
    subData: null,
    chartData: { orders: [], extensions: [], payments: [] },
    totals: { totalOrders: 0, totalGoods: 0, totalSpecies: 0, totalClients: 0 },
  });
  const [passingTime, setPassingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetch = useCallback(
    () => getMainData(setIsLoading, token, setData),
    [token]
  );

  useEffect(() => {
    fetch(
      moment().startOf("month").toDate().toISOString(),
      moment().toDate().toISOString()
    );
  }, [fetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassingTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const subData = useMemo(() => {
    if (!data.subData) return { lastDays: 0, date: null, progress: 0 };
    const { latest } = data.subData;
    const expiring_date = moment(latest.date).add(latest.days, "days");
    const lastMinutes = moment(expiring_date).diff(moment(), "minutes");
    latest.lastHours = Math.floor((lastMinutes / 60) % 24);
    latest.lastDays = Math.floor(lastMinutes / (24 * 60));
    latest.progress =
      (moment(expiring_date).diff(moment(), "seconds") /
        (latest.days * 24 * 60 * 60)) *
      100;
    if (latest.progress < 0) {
      latest.progress = 0;
      latest.lastDays = 0;
      latest.lastHours = 0;
      latest.noSub = true;
    }
    if (false) console.log(passingTime);
    return latest;
  }, [data.subData, passingTime]);

  const totals = useMemo(
    () =>
      Object.keys(dataTemplate).map((key) => ({
        key,
        icon: dataTemplate[key].icon,
        title: dataTemplate[key].title,
        value: data.totals[key],
      })),
    [data.totals]
  );

  const chartDataFormatted = useMemo(() => {
    if (!data.chartData) return null;
    const dataByDate = {};
    function updateDataByDate(array, type) {
      array.forEach((item) => {
        const date = moment(item.date).format("YYYY-MM-DD");
        const amount = item.amount ? item.amount : 1;
        if (!dataByDate[date]) {
          dataByDate[date] = { orders: 0, extensions: 0, payments: 0 };
        }
        dataByDate[date][type] += amount;
      });
    }
    updateDataByDate(data.chartData.orders, "orders");
    updateDataByDate(data.chartData.extensions, "extensions");
    updateDataByDate(data.chartData.payments, "payments");
    const datesArray = [];
    const startDate = moment().startOf("month");
    const daysInMonth = startDate.daysInMonth();
    for (let i = 0; i < daysInMonth; i++) {
      const dateStr = startDate.clone().add(i, "days").format("YYYY-MM-DD");
      datesArray.push(dateStr);
    }
    const final = { dates: [], orders: [], extensions: [], payments: [] };
    datesArray.forEach((date) => {
      final.dates.push(date);
      final.orders.push(dataByDate[date] ? dataByDate[date].orders : 0);
      final.extensions.push(dataByDate[date] ? dataByDate[date].extensions : 0);
      final.payments.push(dataByDate[date] ? dataByDate[date].payment : 0);
    });
    return final;
  }, [data.chartData]);

  const leftContent = (
    <div>
      <InfoRows
        infoRows={[
          {
            type: "rowValue",
            value: `До конца вашей подписки осталось: `,
          },
          {
            type: "partTitle",
            value: subData.noSub
              ? "Нет подписки"
              : `${subData.lastDays} дней ${subData.lastHours} часов`,
          },
        ]}
        margin="0"
      />
      <MyProgressBar
        variant="determinate"
        value={subData.progress}
        sx={{ marginTop: 2, marginBottom: 1 }}
      />
      <InfoRows
        infoRows={[
          { type: "rowTitle", value: `Пополните до: ` },
          {
            type: "rowValue",
            value: subData
              ? `До ${moment(subData.date)
                  .add(subData.days, "days")
                  .format(dateFormat)}`
              : "Пожалуйста, обновите свою подписку",
          },
          { type: "rowTitle", value: `Остаток баланса СМС: ` },
          {
            type: "rowValue",
            value: `${data.subData ? data.subData.messages : 0} сообщений`,
          },
        ]}
        margin="0"
      />
    </div>
  );
  const mainContent = (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        {totals.map((item) => (
          <Grid key={item.key} item xs={2} sm={4} md={3}>
            <Item variant="outlined">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <IconWrapper size={40}>{item.icon}</IconWrapper>
                <InfoRows
                  align="center"
                  infoRows={[
                    { type: "rowTitle", value: item.title },
                    { type: "partTitle", value: item.value },
                  ]}
                  margin="0"
                />
              </Box>
            </Item>
          </Grid>
        ))}
      </Grid>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: 250,
          marginRight: 1,
          overflow: "auto",
          marginTop: 3,
        }}
      >
        {chartDataFormatted && (
          <LineChart
            xAxis={[{ scaleType: "point", data: chartDataFormatted.dates }]}
            yAxis={[{ id: "leftAxis" }, { id: "rightAxis" }]}
            series={[
              {
                data: chartDataFormatted.orders,
                yAxisKey: "leftAxis",
                label: "Оформлено заказов",
                color: "blue",
              },
              {
                data: chartDataFormatted.extensions,
                yAxisKey: "leftAxis",
                label: "Оформлено продлений",
                color: "red",
              },
              {
                data: chartDataFormatted.payments,
                yAxisKey: "rightAxis",
                label: "Принято оплаты",
                color: "green",
              },
            ]}
            width={1000}
          >
            <ChartsXAxis />
            <ChartsYAxis axisId="leftAxis" />
            <ChartsYAxis axisId="rightAxis" position="right" />
          </LineChart>
        )}
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <MyButton
          text="Создать новый заказ"
          onClick={() => navigate("/orders/0/1")}
          color={{ default: "#85c442", dark: "#7ab835" }}
        />
      </Box>
    </Box>
  );

  return (
    <ContainerLayout
      searchButtonLoading={() => {}}
      leftContent={
        isLoading ? (
          <div className="LoadingWrapper1">
            <Loading which="gray" />
          </div>
        ) : (
          leftContent
        )
      }
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

export default Main;
