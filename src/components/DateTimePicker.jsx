import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import moment from "moment";
import styled from "styled-components";
import { useState, useEffect } from "react";

const DatePickerWrapper = styled.div`
  margin: ${(props) => props.style?.dateTimePickerMargin};
  width: 100%;
`;

const DateTimePicker = ({
  disabled,
  label,
  dateTime = moment(),
  setDateTime,
  step,
  calendar,
  margin = "0",
}) => {
  const [date, setDate] = useState(
    moment(dateTime).isValid()
      ? moment(dateTime).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD")
  );
  const [time, setTime] = useState(
    moment(dateTime).isValid()
      ? moment(dateTime).format("HH:mm")
      : moment().format("HH:mm")
  );

  useEffect(() => {
    const temp = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
    if (temp.isValid()) {
      setDateTime(temp);
    }
  }, [date, time, setDateTime]);

  return (
    <DatePickerWrapper style={{ dateTimePickerMargin: margin }}>
      <DatePicker
        calendar={calendar}
        label={label}
        date={date}
        setDate={setDate}
        disabled={disabled}
      />
      <TimePicker
        time={time}
        setTime={setTime}
        step={step}
        disabled={disabled}
      />
    </DatePickerWrapper>
  );
};

export default DateTimePicker;
