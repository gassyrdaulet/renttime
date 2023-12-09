import style from "styled-components";

const MyButtonContainer = style.div`
    display: flex;
    align-items: center;
    justify-content: center;    
`;
const MyButton = style.div`
    padding: 10px;
    font-size: 13px;
    margin: 0 auto;
    background-color: transparent;
    color: ${(props) => (props.disabled ? "gray" : "blue")};
    border: none;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    &:hover{
      text-decoration: ${(props) => (props.disabled ? "none" : "underline")};
    }
   `;

const BlueLinkButton = ({ text, onClick, disabled }) => {
  return (
    <MyButtonContainer>
      <MyButton
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
