import styled from "styled-components";

const InputContainer = styled.div`
  margin-bottom: 10px;
  user-select: none;
  width: 100%;
`;
const InputField = styled.textarea`
  resize: none;
  padding: 10px;
  width: 100%;
  border: 1px solid gray;
  border-radius: 5px;
  font-size: 16px;
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
const InputWrapper = styled.span`
  position: relative;
`;
const LabelText = styled.p`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const RightIcon = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  & svg {
    width: 20px;
  }
`;

const MyTextarea = ({
  placeholder,
  label,
  type,
  value,
  onChange,
  disabled,
  autoComplete,
  inputMode,
  right,
  inputRef,
  max,
  onClickRight = () => {},
}) => {
  return (
    <InputContainer>
      <LabelText>{label}</LabelText>
      <InputWrapper>
        <InputField
          placeholder={placeholder}
          spellCheck={false}
          disabled={disabled}
          type={type}
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
          autoComplete={autoComplete}
        />
        <RightIcon onClick={onClickRight}>{right}</RightIcon>
      </InputWrapper>
    </InputContainer>
  );
};

export default MyTextarea;
