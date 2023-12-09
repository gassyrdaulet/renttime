import DateTime from "react-datetime";
import styled from "styled-components";
import "react-datetime/css/react-datetime.css";
import "moment/locale/ru";
import MyInput from "./MyInput";
import moment from "moment";
import { IoMdCloseCircleOutline } from "react-icons/io";

const DatePickerWrapper = styled.div`
  width: 100%;
  padding-bottom: 10px;
`;
const DateTimeWrapper = styled.div`
  width: 100%;
  padding: 5px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
`;

const DatePicker = ({
  disabled,
  label,
  timeFormat,
  selectedDate,
  handleDateChange,
}) => {
  return (
    <DatePickerWrapper>
      <MyInput
        disabled={disabled}
        label={label}
        value={
          selectedDate ? moment(selectedDate).format("DD.MM.yyyy HH:mm") : ""
        }
        onChange={() => {}}
        right={<IoMdCloseCircleOutline size={22} />}
        onClickRight={() => {
          if (!disabled) handleDateChange(null);
        }}
      />
      <DateTimeWrapper>
        <DateTime
          locale="ru"
          timeFormat={disabled ? false : timeFormat}
          dateFormat="DD.MM.yyyyг."
          value={selectedDate}
          onChange={(v) => {
            if (!disabled) handleDateChange(v);
          }}
          input={false}
        />
      </DateTimeWrapper>
    </DatePickerWrapper>
  );
};

export default DatePicker;
