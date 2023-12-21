import styled from "styled-components";

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 10px;
  user-select: none;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ffccaa;
  padding: 10px;
  border-radius: 5px;
`;
const Label = styled.p`
  user-select: none;
`;
const SwitchInput = styled.input`
  cursor: pointer;
`;

const Switch = ({ label, isChecked, setChecked, disabled }) => {
  const handleToggle = () => {
    setChecked(!isChecked);
  };

  return (
    <SwitchLabel>
      <Label>{label}</Label>
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
