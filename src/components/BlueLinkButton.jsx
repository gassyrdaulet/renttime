import style from "styled-components";

const MyButtonContainer = style.div`
    display: flex;
    align-items: center;
    justify-content: center;    
`;
const MyButton = style.div`
    padding: ${(props) => props.style.buttonPadding};
    font-size: 13px;
    margin: 0 auto;
    background-color: transparent;
    color: ${(props) => (props.disabled ? "gray" : "blue")};
    border: none;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    user-select: none;
    &:hover{
      text-decoration: ${(props) => (props.disabled ? "none" : "underline")};
    }
   `;

const BlueLinkButton = ({ text, onClick, disabled, padding = "10px" }) => {
  return (
    <MyButtonContainer>
      <MyButton
        style={{ buttonPadding: padding }}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            return;
          }
          onClick(e);
        }}
      >
        {text}
      </MyButton>
    </MyButtonContainer>
  );
};

export default BlueLinkButton;
