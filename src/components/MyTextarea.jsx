import styled from "styled-components";

const Container = styled.div`
  user-select: none;
  width: 100%;
  margin: ${(props) => props.style?.containerMargin};
`;
const Field = styled.textarea`
  resize: none;
  padding: 10px;
  width: 100%;
  border: 1px solid gray;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  font-size: ${(props) => props.style?.fontSize}
  &:focus {
    border-color: blue;
  }
  &:disabled {
    border: 1px solid gray;
    color: gray;
    background-color: #eeeeee;
  }
`;
const Wrapper = styled.span`
  position: relative;
`;
const LabelText = styled.p`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MyTextarea = ({
  margin = "0 0 10px 0",
  onChange = () => {},
  fontSize = 16,
  spellCheck = false,
  placeholder,
  label,
  value,
  disabled,
  inputMode,
  inputRef,
  max,
}) => {
  return (
    <Container style={{ containerMargin: margin }}>
      {label && <LabelText>{label}</LabelText>}
      <Wrapper>
        <Field
          style={{ areaFontSize: fontSize }}
          placeholder={placeholder}
          spellCheck={spellCheck}
          disabled={disabled}
          ref={inputRef}
          value={value}
          inputMode={inputMode}
          onChange={(e) => {
            if (max) {
              const value = e.target.value;
              if (value.length > max) {
                return;
              }
            }
            onChange(e);
          }}
        />
      </Wrapper>
    </Container>
  );
};

export default MyTextarea;
