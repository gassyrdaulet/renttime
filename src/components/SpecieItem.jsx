import styled from "styled-components";
import moment from "moment";
import { useMemo, useState } from "react";
import config from "../config/config.json";
import { FaPencilAlt } from "react-icons/fa";
import Modal from "./Modal";
import EditSpecieForm from "../components/EditSpecieForm";

const { SPECIE_STATUSES, SPECIE_STATUSES_COLORS } = config;

const SpecieContainer = styled.div`
  position: relative;
  max-width: 210px;
  min-width: 210px;
  height: 100px;
  padding: 10px;
  box-sizing: border-box;
  border: ${(props) => (props.style?.isMarked ? "2px" : "1px")} solid
    ${(props) => (props.style?.isMarked ? props.style.markColor : "#ccc")};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  cursor: ${(props) => props.style.cursorType};
  transition: background-color 0.1s;
  &:hover {
    background-color: #efefef;
  }
  @media (max-width: 600px) {
    max-width: 150px;
    min-width: 150px;
    padding: 5px;
    height: 80px;
  }
`;
const SpecieInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const SpecieInfoHalf = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
`;
const SpecieInfo = styled.div`
  display: block;
`;
const SpecieInfoTitle = styled.p`
  font-size: 10px;
  color: #cecece;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
  @media (max-width: 600px) {
    font-size: 8px;
  }
`;
const SpecieInfoText = styled.p`
  font-size: 14px;
  color: ${(props) => props.style.color},
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: ${(props) =>
    props.style?.userSelect ? props.style.userSelect : "none"};
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;
const DeleteButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 5px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #ccc;
  }
  margin: 2px;
`;
const DeleteButtonIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
`;

function SpecieItem({
  specieItem,
  onClick,
  marked,
  editButton,
  next,
  cursorType = "pointer",
  editLoading,
  setEditLoading,
}) {
  const [editModal, setEditModal] = useState(false);
  const firstHalf = useMemo(
    () => [
      {
        value: specieItem?.["id"],
        title: "ID",
      },
      {
        value: String(specieItem?.["code"]).padStart(10, "0"),
        title: "Инв. номер",
        userSelect: "inherit",
      },
      {
        value: specieItem?.["order"] ? specieItem["order"] : "-",
        title: "Заказ",
      },
    ],
    [specieItem]
  );
  const secondHalf = useMemo(
    () => [
      {
        value: SPECIE_STATUSES?.[specieItem?.["status"]]
          ? SPECIE_STATUSES[specieItem?.["status"]]
          : specieItem?.["status"],
        title: "Статус",
        color: SPECIE_STATUSES_COLORS?.[specieItem?.["status"]],
      },
      {
        value: moment(specieItem?.["created_date"]).format("DD.MM.yyyy"),
        title: "Дата создания",
      },
      {
        value: specieItem?.["good"] ? specieItem["good"] : "-",
        title: "ID товара",
      },
    ],
    [specieItem]
  );

  return (
    <SpecieContainer
      onClick={onClick}
      style={{
        isMarked: marked?.isMarked,
        markColor: marked?.markColor,
        cursorType,
      }}
    >
      <SpecieInfoWrapper>
        <SpecieInfoHalf>
          {firstHalf.map((item) => (
            <SpecieInfo key={item.title}>
              <SpecieInfoTitle>{item.title}</SpecieInfoTitle>
              <SpecieInfoText
                style={{ userSelect: item.userSelect, color: item.color }}
              >
                {item.value}
              </SpecieInfoText>
            </SpecieInfo>
          ))}
        </SpecieInfoHalf>
        <SpecieInfoHalf>
          {secondHalf.map((item) => (
            <SpecieInfo key={item.title}>
              <SpecieInfoTitle>{item.title}</SpecieInfoTitle>
              <SpecieInfoText
                style={{ userSelect: item.userSelect, color: item.color }}
              >
                {item.value}
              </SpecieInfoText>
            </SpecieInfo>
          ))}
        </SpecieInfoHalf>
        {editButton && (
          <DeleteButtonWrapper
            onClick={() => {
              if (!editLoading) {
                setEditModal(true);
              }
            }}
          >
            <DeleteButtonIconWrapper>
              <FaPencilAlt size={14} />
            </DeleteButtonIconWrapper>
          </DeleteButtonWrapper>
        )}
      </SpecieInfoWrapper>
      <Modal
        modalVisible={editModal}
        setModalVisible={setEditModal}
        noEscape={editLoading}
        title="Редактирование единицы"
      >
        <EditSpecieForm
          isLoading={editLoading}
          setIsLoading={setEditLoading}
          specieInfo={specieItem}
          next={() => {
            setEditModal(false);
            next();
          }}
        />
      </Modal>
    </SpecieContainer>
  );
}

export default SpecieItem;
