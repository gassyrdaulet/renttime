import styled from "styled-components";

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 5px;
  &:hover {
    background-color: #cccccc;
  }
`;
const ControlPanelButton = styled.div`
  display: flex;
  align-items: center;
`;
const ControlPanelTitle = styled.div`
  font-size: 12px;
  max-width: 100px;
  margin-right: 5px;
  text-align: end;
`;
const ControlPanelIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ControlPanelButtons({ controlPanelButtons }) {
  return (
    <ButtonsWrapper>
      {controlPanelButtons.map((button) => (
        <ControlPanelButton onClick={button.onClick} key={button.id}>
          <ControlPanelTitle>{button.title}</ControlPanelTitle>
          <ControlPanelIconWrapper>{button.icon}</ControlPanelIconWrapper>
        </ControlPanelButton>
      ))}
    </ButtonsWrapper>
  );
}

export default ControlPanelButtons;
