import { useRef, useEffect } from "react";
import { useOutsideAlerter } from "../hooks/useOutsideAlerter";
import useAuth from "../hooks/useAuth";
import cl from "../styles/Modal.module.css";
import styled from "styled-components";
import { IoMdCloseCircleOutline } from "react-icons/io";

const CloseModal = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
`;
const IconContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const TitleWrapper = styled.p`
  width: 100%;
  font-size: 15px;
  text-align: center;
  user-select: none;
`;

const Modal = ({
  children,
  setModalVisible,
  modalVisible,
  noEscape,
  title,
  onlyByClose,
}) => {
  const modalRef = useRef(null);
  const { setFixed } = useAuth();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, scaleY: 0.2, scaleX: 1.5 },
    visible: {
      opacity: 1,
      scale: 1,
      scaleY: 1,
      scaleX: 1,
    },
    exit: { scaleY: 4, scaleX: 0.05, opacity: 0, scale: 0.8 },
  };

  useEffect(() => {
    if (modalVisible) {
      setFixed(true);
    } else {
      setFixed(false);
    }
  }, [modalVisible, setFixed]);

  useOutsideAlerter(modalRef, () => {
    if (!noEscape && !onlyByClose) {
      setModalVisible(false);
    }
  });

  return modalVisible ? (
    <div className={cl.modalWrapper}>
      <div variants={modalVariants} ref={modalRef} className={cl.modal}>
        <CloseModal>
          <TitleWrapper>{title}</TitleWrapper>
          <IconContainer
            onClick={() => {
              if (!noEscape) setModalVisible(false);
            }}
          >
            <IoMdCloseCircleOutline size={22} />
          </IconContainer>
        </CloseModal>
        {children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default Modal;
