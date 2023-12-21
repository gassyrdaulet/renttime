import Modal from "./Modal";
import MyButton from "./MyButton";
import styled from "styled-components";

const ConfirmContainerWrapper = styled.div`
  width: 90vw;
  max-width: 500px;
`;
const ConfirmButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px 0 5px;
`;

function ConfirmModal({
  visible,
  setVisible,
  loading,
  title,
  question,
  onConfirm,
}) {
  return (
    <Modal
      modalVisible={visible}
      setModalVisible={setVisible}
      noEscape={loading}
      title={title}
      onlyByClose={false}
    >
      <ConfirmContainerWrapper>
        {question}
        <ConfirmButtonsContainer>
          <MyButton
            text="Нет"
            color={{ default: "#f45e42", dark: "#e84e35" }}
            disabled={loading}
            onClick={() => setVisible(false)}
          />
          <MyButton
            text="Да"
            color={{ default: "#85c442", dark: "#7ab835" }}
            disabled={loading}
            onClick={() => {
              onConfirm();
            }}
          />
        </ConfirmButtonsContainer>
      </ConfirmContainerWrapper>
    </Modal>
  );
}

export default ConfirmModal;
