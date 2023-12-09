import styled from "styled-components";
import ImageContainer from "./ImageContainer";
import { useMemo } from "react";
import config from "../config/config.json";
import {
  FaRegCheckCircle,
  FaCircleNotch,
  FaRegTimesCircle,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const { SPECIE_STATUSES_AVAILABLE, CURRENCIES } = config;

const GoodContainer = styled.div`
  box-sizing: border-box;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;
  width: 100%;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props.style?.isMarked ? "2px" : "1px")} solid
    ${(props) => (props.style?.isMarked ? props.style.markColor : "#ccc")};
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.1s;
  &:hover {
    background-color: #efefef;
  }
`;
const ProductTitle = styled.p`
  font-size: 13px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
  font-weight: 600;
`;
const ProductInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px;
  margin-top: 5px;
`;
const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const PriceInfoTitle = styled.p`
  font-size: 8px;
`;
const PriceInfoValue = styled.p`
  font-size: 10px;
`;

function GoodItem({ goodItem, onClick, index, marked }) {
  const { currency } = useAuth();

  const available = useMemo(() => {
    let count = 0;
    goodItem.species.forEach((item) => {
      if (SPECIE_STATUSES_AVAILABLE?.[item?.status]) {
        count++;
      }
    });
    return count;
  }, [goodItem]);

  const pricesFirst = useMemo(
    () => [
      { name: "мин.", value: goodItem?.price_per_minute },
      { name: "час", value: goodItem?.price_per_hour },
    ],
    [goodItem]
  );

  const pricesSecond = useMemo(
    () => [
      { name: "день", value: goodItem?.price_per_day },
      { name: "мес.", value: goodItem?.price_per_month },
    ],
    [goodItem]
  );

  const availabilities = useMemo(
    () => [
      {
        icon: <FaRegCheckCircle size={10} />,
        id: 0,
        value: available,
      },
      {
        icon: <FaRegTimesCircle size={10} />,
        id: 1,
        value: goodItem?.species.length - available,
      },
      {
        icon: <FaCircleNotch size={10} />,
        id: 2,
        value: goodItem?.species.length,
      },
    ],
    [goodItem, available]
  );

  return (
    <GoodContainer
      onClick={onClick}
      style={{ isMarked: marked?.isMarked, markColor: marked?.markColor }}
    >
      <ProductTitle>
        {index ? index + ". " : ""}
        {goodItem.name}
      </ProductTitle>
      <ImageContainer
        src={goodItem?.photo}
        alt={goodItem?.name}
        size="medium"
        width="95%"
        height="inherit"
        goodId={goodItem.id}
      />
      <ProductInfoRow>
        {availabilities.map((item) => (
          <PriceInfo key={item.id}>
            {item.icon}
            <PriceInfoValue>{item.value}</PriceInfoValue>
          </PriceInfo>
        ))}
      </ProductInfoRow>
      <ProductInfoRow>
        {pricesFirst.map((item) => (
          <PriceInfo key={item.name}>
            <PriceInfoTitle>{item.name}</PriceInfoTitle>
            <PriceInfoValue>
              {item.value ? item.value + CURRENCIES[currency] : "-"}
            </PriceInfoValue>
          </PriceInfo>
        ))}
      </ProductInfoRow>
      <ProductInfoRow>
        {pricesSecond.map((item) => (
          <PriceInfo key={item.name}>
            <PriceInfoTitle>{item.name}</PriceInfoTitle>
            <PriceInfoValue>
              {item.value ? item.value + CURRENCIES[currency] : "-"}
            </PriceInfoValue>
          </PriceInfo>
        ))}
      </ProductInfoRow>
    </GoodContainer>
  );
}

export default GoodItem;
