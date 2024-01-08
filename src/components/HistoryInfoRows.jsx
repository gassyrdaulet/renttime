import styled from "styled-components";
import BlueLinkButton from "./BlueLinkButton";

const HistoryItemWrapper = styled.div`
  border: 1px solid #ffccaa;
  border-radius: 5px;
  padding: 3px;
  margin-bottom: 2px;
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

function HistoryInfoRows({ title, historyRows }) {
  return (
    <div>
      <InfoPartTitle>{title}</InfoPartTitle>
      {historyRows?.length === 0 && <p>Ничего не найдено</p>}
      {historyRows?.map((item) => {
        return (
          <HistoryItemWrapper key={item.id}>
            <InfoRowTitle title={item.hoverTitle}>{item.title}</InfoRowTitle>
            {item?.values?.map((value, i) => {
              return <InfoRowValue key={i}>{value}</InfoRowValue>;
            })}
            {item?.buttons?.map((value, i) => {
              return (
                <BlueLinkButton
                  key={i}
                  padding="0 0 5px 0"
                  text={value.text}
                  onClick={value.onClick}
                />
              );
            })}
          </HistoryItemWrapper>
        );
      })}
    </div>
  );
}

export default HistoryInfoRows;
