import styled from "styled-components";

const InfoRowsWrapper = styled.div`
  margin: ${(props) => props.style.containerMargin};
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.style?.align};
  text-align: center;
`;
const InfoRowBigTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  user-select: none;
`;
const InfoPartTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  margin-top: 10px;
  user-select: none;
`;
const InfoRowTitle = styled.div`
  font-size: 13px;
  color: #aaaaaa;
  margin-top: 5px;
  user-select: none;
`;
const InfoRowValue = styled.div`
  font-size: 14px;
`;

function InfoRows({ infoRows = [], margin = "0", align = "start" }) {
  return (
    <InfoRowsWrapper style={{ containerMargin: margin, align }}>
      {infoRows.length === 0 && <p>Ничего не найдено</p>}
      {infoRows.map((item, i) => {
        const value = item.value
          ? item.value === "Invalid date"
            ? "-"
            : item.value
          : "-";
        if (item.type === "partTitle") {
          return <InfoPartTitle key={i}>{value}</InfoPartTitle>;
        }
        if (item.type === "rowBigTitle") {
          return <InfoRowBigTitle key={i}>{value}</InfoRowBigTitle>;
        }
        if (item.type === "rowTitle") {
          return <InfoRowTitle key={i}>{value}</InfoRowTitle>;
        }
        if (item.type === "rowValue") {
          return <InfoRowValue key={i}>{value}</InfoRowValue>;
        }
        return "";
      })}
    </InfoRowsWrapper>
  );
}

export default InfoRows;
