import styled from "styled-components";

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  user-select: none;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ffccaa;
  padding: 10px;
  border-radius: 5px;
  margin: ${(props) => props.style?.switchMargin};
`;
const Label = styled.p`
  user-select: none;
  color: ${(props) => props.disabled && "gray"};
`;
const SwitchInput = styled.input`
  cursor: pointer;
`;

const Switch = ({
  label,
  isChecked,
  setChecked,
  disabled,
  margin = "0 0 10px 0",
}) => {
  const handleToggle = () => {
    setChecked(!isChecked);
  };

  return (
    <SwitchLabel style={{ switchMargin: margin }}>
      <Label disabled={disabled}>{label}</Label>
      <SwitchInput
        type="checkbox"
        disabled={disabled}
        checked={isChecked}
        onChange={handleToggle}
      />
    </SwitchLabel>
  );
};

export default Switch;
