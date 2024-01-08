import styled from "styled-components";

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

function InfoRows({ infoRows = [] }) {
  return (
    <div>
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
        if (item.type === "rowTitle") {
          return <InfoRowTitle key={i}>{value}</InfoRowTitle>;
        }
        if (item.type === "rowValue") {
          return <InfoRowValue key={i}>{value}</InfoRowValue>;
        }
        return "";
      })}
    </div>
  );
}

export default InfoRows;
