import { useMemo, useState, useCallback, useEffect } from "react";
import moment from "moment";
import styled from "styled-components";
import MyButton from "./MyButton";
import Input from "./Input";
import Switch from "./Switch";
import InputInteger from "./InputInteger";
import MyTextarea from "./MyTextarea";
import Select from "./Select";
import DateTimePicker from "./DateTimePicker";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Loading from "./Loading";

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.style?.formWidth};
  height: ${(props) => props.style?.formHeight};
  max-width: ${(props) => props.style?.formMaxWidth};
  max-height: ${(props) => props.style?.formMaxHeight};
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
`;
const ContainerRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
const ContainerColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.style?.columnWidth};
  @media (max-width: 800px) {
    width: 100%;
  }
`;
const ColumnItems = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const ColumnItem = styled.div`
  display: flex;
  width: ${(props) =>
    props.style?.itemWidth ? props.style.itemWidth : "100%"};
`;
const ItemWrapper = styled.div`
  width: 100%;
`;
const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 10px 0px 10px;
  border-top: 1px solid #c3c3c3;
`;

function flattenArray(arr) {
  let result = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result = result.concat(flattenArray(item));
    } else {
      result.push(item);
    }
  });

  return result;
}

function InputsLayout({
  inputs = [],
  buttons = [],
  height = "60vh",
  width = "80vw",
  maxHeight = "60vh",
  maxWidth = "800px",
  disabled = false,
  loading = false,
}) {
  const [inputsData, setInputsData] = useState(inputs);

  useEffect(() => {
    setInputsData(inputs);
  }, [inputs]);

  const data = useMemo(() => {
    const data = {};
    flattenArray(inputsData).forEach((item) => {
      if (item.switchLabel) {
        if (!item.switch) {
          return;
        }
      }
      if (!item.value) {
        return;
      }
      if (item.type === "date" || item.type === "datetime") {
        data[item.id] = moment(item.value).toDate();
        return;
      }
      data[item.id] = item.value;
    });
    return data;
  }, [inputsData]);

  const handleInputChange = useCallback((id, value) => {
    setInputsData((prev) => {
      const temp = [...prev];
      function updateObjectInNestedArray(arr, id, value) {
        arr.forEach((item) => {
          if (Array.isArray(item)) {
            updateObjectInNestedArray(item, id, value);
          } else if (item && item.id === id) {
            item.value = value;
          }
        });
      }
      updateObjectInNestedArray(temp, id, value);
      return temp;
    });
  }, []);

  const handleSwitchChange = useCallback((id, checked) => {
    setInputsData((prev) => {
      const temp = [...prev];
      function updateObjectInNestedArray(arr, id, checked) {
        arr.forEach((item) => {
          if (Array.isArray(item)) {
            updateObjectInNestedArray(item, id, checked);
          } else if (item && item.id === id) {
            item.switch = checked;
          }
        });
      }
      updateObjectInNestedArray(temp, id, checked);
      return temp;
    });
  }, []);

  const inputTypes = useMemo(
    () => ({
      text: (item) => (
        <Input
          onChange={(e) => {
            handleInputChange(item.id, e.target.value);
          }}
          label={item.label}
          value={item.value ? item.value : ""}
          disabled={disabled}
          placeholder={item.placeholder}
        />
      ),
      int: (item) => (
        <InputInteger
          onChange={(e) => {
            handleInputChange(item.id, parseInt(e.target.value));
          }}
          label={item.label}
          value={item.value}
          disabled={disabled}
          placeholder={item.placeholder}
        />
      ),
      textarea: (item) => (
        <MyTextarea
          onChange={(e) => {
            handleInputChange(item.id, e.target.value);
          }}
          label={item.label}
          value={item.value}
          disabled={disabled}
          placeholder={item.placeholder}
          max={item.max}
        />
      ),
      switch: (item) => (
        <Switch
          setChecked={(v) => {
            handleInputChange(item.id, v);
          }}
          label={item.label}
          isChecked={item.value}
          disabled={disabled}
        />
      ),
      select: (item) => (
        <Select
          options={item.options}
          setValue={(v) => {
            handleInputChange(item.id, v);
          }}
          label={item.label}
          value={item.value}
          disabled={disabled}
        />
      ),
      datetime: (item) => (
        <DateTimePicker
          disabled={disabled}
          label={item.label}
          dateTime={item.value}
          setValue={(v) => {
            handleInputChange(item.id, v);
          }}
          calendar={item.calendar}
          step={item.step}
        />
      ),
      date: (item) => (
        <DatePicker
          disabled={disabled}
          label={item.label}
          date={item.value}
          setDate={(v) => {
            handleInputChange(item.id, v);
          }}
          calendar={item.calendar}
        />
      ),
      time: (item) => (
        <TimePicker
          disabled={disabled}
          label={item.label}
          time={item.value}
          setTime={(v) => {
            handleInputChange(item.id, v);
          }}
          step={item.step}
        />
      ),
    }),
    [disabled, handleInputChange]
  );

  if (loading) {
    return (
      <Wrapper
        style={{
          formHeight: height,
          formWidth: width,
          formMaxWidth: maxWidth,
          formMaxHeight: maxHeight,
        }}
      >
        <div className="LoadingWrapper1">
          <Loading which={"gray"} />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      style={{
        formHeight: height,
        formWidth: width,
        formMaxWidth: maxWidth,
        formMaxHeight: maxHeight,
      }}
    >
      <Container>
        {inputsData.map((row, index) => (
          <ContainerRow key={index}>
            {row.map((column, index) => (
              <ContainerColumn
                style={{
                  columnWidth:
                    row?.length > 1
                      ? `${Math.floor(100 / row?.length) - 1}%`
                      : "100%",
                }}
                key={index}
              >
                {column.map((items, index) => (
                  <ColumnItems key={index}>
                    {items.map((item) => (
                      <ColumnItem
                        key={item.id}
                        style={{ itemWidth: item.width }}
                      >
                        <ItemWrapper>
                          {item.switchLabel && (
                            <Switch
                              label={item.switchLabel}
                              isChecked={item.switch}
                              setChecked={(v) => {
                                handleSwitchChange(item.id, v);
                              }}
                              disabled={disabled}
                            />
                          )}
                          {item.switchLabel
                            ? item.switch && inputTypes[item.type]?.(item)
                            : inputTypes[item.type]?.(item)}
                        </ItemWrapper>
                      </ColumnItem>
                    ))}
                  </ColumnItems>
                ))}
              </ContainerColumn>
            ))}
          </ContainerRow>
        ))}
      </Container>
      <ButtonsContainer>
        {buttons.map((item) => (
          <MyButton
            key={item.id}
            type={item.type}
            loading={String(item.isLoading)}
            disabled={disabled || item.isLoading}
            text={item.text}
            onClick={(e) => {
              e.preventDefault();
              item.onClick(data, e);
            }}
            margin="0 10px 0 0"
          />
        ))}
      </ButtonsContainer>
    </Wrapper>
  );
}

export default InputsLayout;
