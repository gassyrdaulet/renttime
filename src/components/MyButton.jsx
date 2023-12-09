import styled from "styled-components";
import Loading from "./Loading";

const StyledButton = styled.button`
  position: relative;
  margin: ${(props) => props.style.margin};
  background-color: ${(props) =>
    props.loading === "true"
      ? props.color.dark
      : props.color.default}; /* Цвет фона кнопки */
  color: ${(props) => (props.loading === "true" ? "transparent" : "#fff")};
  border: none; /* Убираем границу кнопки */
  padding: 10px 20px; /* Отступы внутри кнопки */
  border-radius: 5px; /* Закругляем углы */
  border-top-left-radius: ${(props) => props.color.borderTLRadius};
  border-bottom-left-radius: ${(props) => props.color.borderBLRadius};
  height: ${(props) => props.color.height};
  cursor: pointer; /* Курсор меняется на указатель при наведении */
  user-select: none;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: ${(props) => props.color.dark};
  }
  &:disabled {
    filter: brightness(0.7);
    cursor: default;
  }
  &:disabled:hover {
    background-color: ${(props) => props.color.default};
  }
`;
const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MyButton = ({
  type,
  text,
  onClick,
  disabled,
  loading,
  color = { default: "#4e8dcc", dark: "#3361a1" },
  margin = "0 0 5px 0",
  height,
  borderTLRadius = "5px",
  borderBLRadius = "5px",
}) => {
  return (
    <StyledButton
      disabled={disabled}
      loading={loading}
      type={type}
      color={{ ...color, borderBLRadius, borderTLRadius, height }}
      onClick={onClick}
      style={{ margin }}
    >
      {text}
      {loading === "true" && (
        <LoaderContainer>
          <Loading which="small" />
        </LoaderContainer>
      )}
    </StyledButton>
  );
};

export default MyButton;
