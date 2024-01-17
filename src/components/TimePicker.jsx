import Input from "./Input";

function TimePicker({
  margin,
  time = "00:00",
  setTime,
  step,
  label,
  disabled,
}) {
  return (
    <Input
      label={label}
      margin={margin}
      value={time}
      onChange={(e) => setTime(e.target.value)}
      type="time"
      step={step}
      disabled={disabled}
    />
  );
}

export default TimePicker;
