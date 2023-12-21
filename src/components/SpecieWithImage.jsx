import styled from "styled-components";
import ImageContainer from "./ImageContainer";
import { useMemo } from "react";
import config from "../config/config.json";
import useAuth from "../hooks/useAuth";

const { TARIFF_KEYS, TARIFF_UNITS, CURRENCIES } = config;

const SpecieContainer = styled.div`
  position: relative;
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
const IconWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  right: 5px;
`;

function SpecieWithImage({
  tariff,
  itemInfo,
  onClick,
  index,
  marked,
  icon,
  onClickIcon,
}) {
  const { currency } = useAuth();
  const idInfo = useMemo(
    () => [
      {
        title: "ID единицы",
        id: 0,
        value: itemInfo?.specie?.id,
      },
      {
        title: TARIFF_UNITS[tariff],
        id: 1,
        value: `${
          itemInfo.saved_price
            ? itemInfo.saved_price
            : itemInfo.good?.[TARIFF_KEYS[tariff]]
        } ${CURRENCIES[currency]}`,
      },
      {
        title: "Инв. номер",
        id: 2,
        value: String(itemInfo?.specie?.code).padStart(10, "0"),
      },
    ],
    [itemInfo, tariff, currency]
  );

  return (
    <SpecieContainer
      onClick={onClick}
      style={{ isMarked: marked?.isMarked, markColor: marked?.markColor }}
    >
      <ProductTitle>
        {index ? index + ". " : ""}
        {itemInfo?.good?.name}
      </ProductTitle>
      <ImageContainer
        src={itemInfo?.good?.photo}
        alt={itemInfo?.good?.name}
        size="medium"
        width="95%"
        height="inherit"
        goodId={itemInfo?.good?.id}
      />
      <ProductInfoRow>
        {idInfo.map((item) => (
          <PriceInfo key={item.id}>
            <PriceInfoTitle>{item.title}</PriceInfoTitle>
            <PriceInfoValue>{item.value}</PriceInfoValue>
          </PriceInfo>
        ))}
      </ProductInfoRow>
      <IconWrapper onClick={onClickIcon}>{icon}</IconWrapper>
    </SpecieContainer>
  );
}

export default SpecieWithImage;
