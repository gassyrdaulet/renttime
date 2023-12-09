import { useState, useEffect } from "react";
import styled from "styled-components";
import SearchInput from "./SearchInput";
import MyButton from "./MyButton";
import useFocus from "../hooks/useFocus";
import Loading from "./Loading";

const AsynSelectContainer = styled.div`
  display: block;
  position: relative;
  width: 100%;
`;
const SearchInputWrapper = styled.div`
  display: flex;
`;
const Options = styled.div`
  position: absolute;
  display: block;
  width: 100%;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px 0;
  background-color: white;
  margin-top: 2px;
  z-index: 5;
  max-height: 30vh;
  overflow-y: auto;
`;
const Option = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: #ddd;
  }
`;
const OptionRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  user-select: none;
  padding: 10px;
`;

function AsyncSelect({
  disabled,
  loading,
  buttonText,
  placeholder,
  onClickButton,
  setSelectedOption,
  selectedOption,
  options,
  onChangeText,
}) {
  const [searchInputText, setInputSearchText] = useState("");
  const [inputRef, isFocused] = useFocus();

  useEffect(() => {
    if (!isFocused) {
      if (selectedOption) {
        setInputSearchText("");
      }
    }
  }, [isFocused, selectedOption]);

  return (
    <AsynSelectContainer>
      <SearchInputWrapper>
        <SearchInput
          disabled={disabled}
          inputRef={inputRef}
          value={searchInputText}
          setValue={(v) => {
            setInputSearchText(v);
            onChangeText(v);
          }}
          maxLetters={20}
          placeholder={selectedOption ? selectedOption.value : placeholder}
          borderBRRadius={onClickButton && "0"}
          borderTRRadius={onClickButton && "0"}
        />
        {onClickButton && (
          <MyButton
            disabled={disabled}
            margin="0"
            borderBLRadius="0"
            borderTLRadius="0"
            text={buttonText}
            onClick={onClickButton}
          />
        )}
      </SearchInputWrapper>
      {isFocused && searchInputText && (
        <Options>
          {loading ? (
            <OptionRow>
              <Loading which="smalldark" />
            </OptionRow>
          ) : (
            options.map((item) => (
              <Option
                onMouseDown={() => {
                  setInputSearchText("");
                  setSelectedOption(item);
                }}
                key={item.id}
              >
                {item.value}
              </Option>
            ))
          )}
          {!loading && options.length === 0 && (
            <OptionRow>Ничего не найдено</OptionRow>
          )}
        </Options>
      )}
    </AsynSelectContainer>
  );
}

export default AsyncSelect;
