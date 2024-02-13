import styled from "styled-components";

const InputContainer = styled.div`
  margin: ${(props) => props.style.margin};
  user-select: none;
  width: 100%;
`;
const InputField = styled.input`
  -webkit-appearance: none;
  background-color: white;
  padding: 10px;
  width: 100%;
  border: 1px solid;
  border-radius: 5px;
  border-color: ${(props) => props.style.inputFieldBorderColor};
  font-size: ${(props) => props.style?.inputFontSize}px;
  text-align: ${(props) => props.style?.align};
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: blue;
  }
  &:disabled {
    border: 1px solid gray;
    color: gray;
    background-color: #eeeeee;
  }
`;
const LabelText = styled.p`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Input = ({
  textAlign = "start",
  fontSize = 16,
  spellCheck = false,
  autoComplete = "off",
  margin = "0 0 10px 0",
  onChange = () => {},
  value = "",
  borderColor = "gray",
  label,
  type,
  disabled,
  inputMode,
  inputRef,
  step,
  placeholder,
  max,
  min,
}) => {
  return (
    <InputContainer style={{ margin }}>
      {label && <LabelText>{label}</LabelText>}
      <InputField
        spellCheck={spellCheck}
        style={{
          inputFontSize: fontSize,
          align: textAlign,
          inputFieldBorderColor: borderColor,
        }}
        disabled={disabled}
        type={type}
        ref={inputRef}
        value={value}
        inputMode={inputMode}
        onChange={onChange}
        autoComplete={autoComplete}
        step={step}
        placeholder={placeholder}
        max={max}
        min={min}
      />
    </InputContainer>
  );
};

export default Input;
