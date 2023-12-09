import Datetime from "react-datetime";
import styled from "styled-components";
import "react-datetime/css/react-datetime.css";

const Label = styled.p`
  user-select: none;
`;

const CustomTimePicker = ({ time, label, setTime, step }) => {
  return (
    <div>
      <Label>{label}</Label>
      <Datetime
        value={time}
        timeFormat="HH:mm"
        dateFormat={false}
        timeConstraints={{ minutes: { step } }}
        input={false}
        onChange={(t) => setTime(t)}
      />
    </div>
  );
};

export default CustomTimePicker;
