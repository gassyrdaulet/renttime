import React from "react";
import styled from "styled-components";
import { IoMdCloseCircleOutline } from "react-icons/io";

const SearchInputDiv = styled.div`
  display: flex;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: ${(props) => props.color.height};
  border-top-right-radius: ${(props) => props.color?.borderTRRadius};
  border-bottom-right-radius: ${(props) => props.color?.borderBRRadius};
  overflow: hidden;
  position: relative;
  width: 100%;
`;
const SearchInputInput = styled.input`
  flex: 1;
  padding: 10px;
  min-width: 0px;
  padding-right: 30px;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  transition: border 0.3s;
  &::placeholder {
    user-select: none;
    overflow: hidden;
  }
`;
const IconContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
`;

function SearchInput({
  inputRef,
  value,
  setValue,
  borderTRRadius = "5px",
  borderBRRadius = "5px",
  height,
  maxLetters,
  placeholder = "Поиск...",
  disabled,
}) {
  return (
    <SearchInputDiv color={{ borderTRRadius, borderBRRadius, height }}>
      <SearchInputInput
        ref={inputRef}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          if (maxLetters) {
            if (e.target.value.length > maxLetters) {
              return;
            }
          }
          e.preventDefault();
          setValue(e.target.value);
        }}
        placeholder={placeholder}
      />
      <IconContainer
        onClick={() => {
          if (!disabled) setValue("");
        }}
      >
        <IoMdCloseCircleOutline size={22} />
      </IconContainer>
    </SearchInputDiv>
  );
}

export default SearchInput;
