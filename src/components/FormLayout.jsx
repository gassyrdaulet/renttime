import MyButton from "./MyButton";
import styled from "styled-components";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  height: ${(props) => props.style?.formHeight};
  width: ${(props) => props.style?.formWidth};
  max-height: ${(props) => props.style?.formHeight};
`;
const FormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const InputContainers = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;
const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  width: 100%;
  @media (max-width: 800px) {
    max-width: ${(props) => props.style?.mobileMaxWidth};
  }
`;
const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 10px 0px 10px;
  border-top: 1px solid #c3c3c3;
`;

function FormLayout({
  firstHalf,
  secondHalf,
  buttons = [],
  mobileMaxWidth = "300px",
  height = "70vh",
  width = "80vw",
}) {
  return (
    <FormWrapper style={{ formHeight: height, formWidth: width }}>
      <FormContainer>
        <InputContainers>
          {firstHalf && (
            <InputsContainer style={{ mobileMaxWidth }}>
              {firstHalf}
            </InputsContainer>
          )}
          {secondHalf && (
            <InputsContainer style={{ mobileMaxWidth }}>
              {secondHalf}
            </InputsContainer>
          )}
        </InputContainers>
      </FormContainer>
      <ButtonsContainer>
        {buttons.map((item) => (
          <MyButton
            key={item.id}
            type={item.type}
            loading={String(item.isLoading)}
            disabled={item.disabled}
            text={item.text}
            onClick={(e) => {
              item.onClick(e);
            }}
            margin="0 10px 0 0"
          />
        ))}
      </ButtonsContainer>
    </FormWrapper>
  );
}

export default FormLayout;
