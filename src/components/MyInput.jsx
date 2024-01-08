import styled from "styled-components";
import { useMemo } from "react";

const InputContainer = styled.div`
  margin: ${(props) => props.style.margin};
  user-select: none;
  width: 100%;
`;
const InputField = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid gray;
  border-radius: 5px;
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

const MyInput = ({
  align = "start",
  fontSize = 16,
  label,
  type,
  value,
  onChange,
  disabled,
  autoComplete,
  inputMode,
  right,
  integer,
  zerofill,
  inputRef,
  unsigned,
  margin = "0 0 10px 0",
  max = 9999999999,
  onClickRight = () => {},
}) => {
  const parsedValue = useMemo(() => {
    if (zerofill) {
      if (zerofill - value.length >= 0) {
        return "0".repeat(zerofill - value.length) + value;
      }
      return "0".repeat(zerofill);
    }
    return value;
  }, [value, zerofill]);

  return (
    <InputContainer style={{ margin }}>
      <LabelText>{label}</LabelText>
      <InputWrapper>
        <InputField
          spellCheck={false}
          style={{ inputFontSize: fontSize, align }}
          disabled={disabled}
          type={type}
          ref={inputRef}
          value={parsedValue}
          inputMode={inputMode}
          onChange={(e) => {
            if (integer) {
              const value = e.target.value;
              const parsedValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
              e.target.value =
                parsedValue > max
                  ? max
                  : unsigned
                  ? Math.abs(parsedValue)
                  : parsedValue;
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

export default MyInput;
