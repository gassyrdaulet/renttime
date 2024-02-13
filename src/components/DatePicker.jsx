import Input from "./Input";
import DateTime from "react-datetime";
import styled from "styled-components";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import "moment/locale/ru";

const DatePickerWrapper = styled.div`
  width: 100%;
  margin: ${(props) => props.style.containerMargin};
`;
const DateTimeWrapper = styled.div`
  width: 100%;
  padding: 5px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
`;

function DatePicker({
  label,
  date = "2000-01-01",
  setDate = () => {},
  disabled,
  calendar = true,
  margin = "0 0 10px 0",
}) {
  return (
    <DatePickerWrapper style={{ containerMargin: margin }}>
      <Input
        borderColor={!moment(date).isValid() ? "red" : "gray"}
        label={label}
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
        type="date"
        max="9999-12-31"
        disabled={disabled}
      />
      {calendar && (
        <DateTimeWrapper>
          <DateTime
            timeFormat={false}
            locale="ru"
            value={moment(date).isValid() && moment(date)}
            onChange={(v) => {
              if (!disabled) setDate(moment(v).format("YYYY-MM-DD"));
            }}
            input={false}
          />
        </DateTimeWrapper>
      )}
    </DatePickerWrapper>
  );
}

export default DatePicker;
