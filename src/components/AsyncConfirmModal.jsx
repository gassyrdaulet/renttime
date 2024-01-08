import Modal from "./Modal";
import MyButton from "./MyButton";
import styled from "styled-components";
import useConfirm from "../hooks/useConfirm";

const ConfirmContainerWrapper = styled.div`
  width: 90vw;
  max-width: 500px;
`;
const ConfirmButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px 0 5px;
`;

function AsyncConfirmModal() {
  const { onConfirm, onCancel, confirmModal, text } = useConfirm();

  return (
    <Modal
      modalVisible={confirmModal}
      setModalVisible={onCancel}
      noEscape={false}
      title="Подтвердите действие"
      onlyByClose={false}
    >
      <ConfirmContainerWrapper>
        {text}
        <ConfirmButtonsContainer>
          <MyButton
            text="Нет"
            color={{ default: "#f45e42", dark: "#e84e35" }}
            onClick={(e) => {
              e.preventDefault();
              onCancel(e);
            }}
          />
          <MyButton
            text="Да"
            color={{ default: "#85c442", dark: "#7ab835" }}
            onClick={(e) => {
              onConfirm(e);
            }}
          />
        </ConfirmButtonsContainer>
      </ConfirmContainerWrapper>
    </Modal>
  );
}

export default AsyncConfirmModal;
