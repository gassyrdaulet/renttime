import styled from "styled-components";

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  user-select: none;
  width: ${(props) => props.style.selectWidth};
`;
const SelectStyled = styled.select`
  width: 100%;
  padding: 9.2px 6px;
  outline: none;
  min-height: 25px;
  background-color: white;
  transition: border-color 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  border: 1px solid gray;
  border-radius: 5px;
  user-select: none;
  &:focus {
    border-color: blue;
  }
  &:disabled {
    border: 1px solid gray;
    color: gray;
    background-color: #eeeeee;
  }
`;

function Select({
  options = [],
  defaultOptions = [],
  loading,
  setValue,
  value,
  disabled,
  label,
  selectWidth = "100%",
}) {
  return (
    <SelectWrapper style={{ selectWidth }}>
      <label>{label}</label>
      <SelectStyled
        value={value}
        onChange={({ target }) => {
          if (loading) return;
          setValue(target.value);
        }}
        disabled={loading || disabled}
      >
        {defaultOptions.map((item) => {
          return (
            <option
              key={item.id}
              disabled={disabled || loading}
              value={item.id}
            >
              {item.name}
            </option>
          );
        })}
        {options.map((option) => {
          return (
            <option
              key={option.id}
              disabled={disabled || loading}
              value={option.id}
            >
              {option.name}
            </option>
          );
        })}
      </SelectStyled>
    </SelectWrapper>
  );
}

export default Select;
