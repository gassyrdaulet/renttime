import Input from "./Input";

const InputInteger = ({
  textAlign,
  fontSize,
  spellCheck,
  autoComplete,
  margin,
  onChange,
  label,
  type,
  value,
  disabled,
  inputMode = "numeric",
  inputRef,
  step,
  placeholder,
  max,
  min,
}) => {
  return (
    <Input
      margin={margin}
      label={label}
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      textAlign={textAlign}
      fontSize={fontSize}
      disabled={disabled}
      type={type}
      ref={inputRef}
      value={String(value)}
      inputMode={inputMode}
      onChange={(e) => {
        const value = e.target.value;
        const parsedValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
        e.target.value = parsedValue > max ? max : parsedValue;
        e.target.value = parsedValue < min ? min : parsedValue;
        onChange(e);
      }}
      step={step}
      placeholder={placeholder}
      max={max}
      min={min}
    />
  );
};

export default InputInteger;
