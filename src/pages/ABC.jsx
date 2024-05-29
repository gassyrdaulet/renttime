import ContainerLayout from "../components/ContainerLayout";
import TableLayout from "../components/TableLayout";
import { useState, useMemo, useEffect, useCallback } from "react";
import InputsLayout from "../components/InputsLayout";
import { getAbcData } from "../api/OrganizationApi";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import config from "../config/config.json";
import moment from "moment";
import InfoRows from "../components/InfoRows";

const { PRICE_TYPES_RU, CURRENCIES, ABC_RATINGS } = config;

function ABC() {
  const [isLoading, setIsLoading] = useState(true);
  const [priceType, setPriceType] = useState(
    localStorage.getItem("price_type")
      ? localStorage.getItem("price_type")
      : "price_per_day"
  );
  const [sortBy, setSortBy] = useState("rating");
  const [data, setData] = useState();
  const { token, currency } = useAuth();

  const fetch = useCallback(
    (first_date, second_date) => {
      getAbcData(setIsLoading, { first_date, second_date }, token, setData);
    },
    [token]
  );

  useEffect(() => {
    fetch(
      moment().startOf("month").toDate().toISOString(),
      moment().toDate().toISOString()
    );
  }, [fetch]);

  const totalOrdersSum = useMemo(() => {
    return data ? data.reduce((sum, item) => sum + item.count, 0) : 0;
  }, [data]);

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
          [
            {
              id: "price_type",
              type: "select",
              value: priceType,
              options: Object.keys(PRICE_TYPES_RU).map((key) => ({
                id: key,
                name: PRICE_TYPES_RU[key],
              })),
              onChange: (v) => {
                setPriceType(v);
                localStorage.setItem("price_type", v);
              },
              label: "Цена",
            },
          ],
          [
            {
              id: "sortby",
              type: "select",
              value: priceType,
              options: [
                { id: "rating", name: "По рейтингу" },
                { id: "name", name: "По наименованию" },
                { id: "priceInt", name: "По цене" },
                { id: "count", name: "По кол.-ву заказов" },
              ],
              onChange: (v) => {
                setSortBy(v);
              },
              label: "Сортировать по",
            },
          ],
        ],
      ],
    ],
    [priceType]
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
        id: "index",
        style: {
          fixedMinWidth: "50px",
          fixedJustWidth: "50px",
          fixedMaxWidth: "50px",
        },
        title: "№",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "name",
        style: {
          fixedMinWidth: "120px",
          fixedJustWidth: "120px",
          fixedMaxWidth: "120px",
        },
        title: "НАИМЕНОВАНИЕ",
        type: "text",
      },
      {
        id: "count",
        style: {
          fixedMinWidth: "90px",
          fixedJustWidth: "90px",
          fixedMaxWidth: "90px",
        },
        dataStyle: { dataAlign: "center" },
        title: "КОЛ.-ВО ЗАКАЗОВ",
        type: "text",
      },
      {
        id: "price",
        style: {
          fixedMinWidth: "80ox",
          fixedJustWidth: "80px",
          fixedMaxWidth: "80px",
        },
        title: PRICE_TYPES_RU[priceType].toLocaleUpperCase(),
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "rating",
        style: {
          fixedMinWidth: "80px",
          fixedJustWidth: "80px",
          fixedMaxWidth: "80px",
        },
        title: "РЕЙТИНГ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "abc",
        style: {
          fixedMinWidth: "80px",
          fixedJustWidth: "80px",
          fixedMaxWidth: "80px",
        },
        title: "ABC",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
    ];
  }, [priceType]);

  const tableData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((item) => {
      const price = item.goodInfo[priceType];
      const rating = (item.count / totalOrdersSum) * 50;
      const parsedRating = isNaN(rating) ? 0 : rating;
      return {
        id: item.good_id,
        name: item.goodInfo.name,
        count: item.count,
        backGroundColor:
          item.count === 0
            ? "#b5b5b5"
            : ABC_RATINGS.sort((a, b) => a.RATING - b.RATING).reduce(
                (prev, item) => {
                  if (parsedRating > item.RATING) {
                    return item.COLOR;
                  } else {
                    return prev;
                  }
                },
                "#fde9e9"
              ),
        priceInt: price,
        price: `${price} ${CURRENCIES[currency]}`,
        rating: parsedRating.toFixed(1),
        abc: ABC_RATINGS.sort((a, b) => a.RATING - b.RATING).reduce(
          (prev, item) => {
            if (parsedRating > item.RATING) {
              return item.LETTER;
            } else {
              return prev;
            }
          },
          "D"
        ),
      };
    });
  }, [data, priceType, currency, totalOrdersSum]);

  const sortedTableData = useMemo(() => {
    return tableData
      .sort((b, a) => {
        if (sortBy === "name") {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === "rating") {
          return parseFloat(a.rating) - parseFloat(b.rating);
        }
        return a[sortBy] - b[sortBy];
      })
      .map((item, index) => ({ index: index + 1, ...item }));
  }, [tableData, sortBy]);

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
        infoRows={[
          { type: "partTitle", value: `Всего заказов: ${totalOrdersSum}` },
          ...ABC_RATINGS.sort((a, b) => b.RATING - a.RATING)
            .map((item) => [
              { type: "rowTitle", value: `Рейтинг ${item.LETTER}` },
              {
                type: "rowValue",
                value: `Больше ${item.RATING}`,
              },
            ])
            .flat(),
        ]}
        margin="0"
      />
    </div>
  );
  const mainContent = (
    <div>
      <TableLayout fontSize={12} headers={headers} data={sortedTableData} />
    </div>
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

export default ABC;
