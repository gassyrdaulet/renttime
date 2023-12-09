import { useState, useCallback } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import styled from "styled-components";
import { createNewGroup } from "../api/GoodsApi";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CreateGroupFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 500px;
`;
const CreateGroupFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const CreateGroupInputContainers = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;
const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  width: 100%;
  @media (max-width: 800px) {
    max-width: 250px;
  }
`;
const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 10px 0px 10px;
  border-top: 1px solid #c3c3c3;
`;

function CreateGroupForm({ createGroupLoading, setCreateGroupLoading }) {
  const [inputs, setInputs] = useState([
    { id: 0, title: "Название", value: "", name: "name", inputMode: "text" },
  ]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = useCallback((id, value) => {
    setInputs((prev) => {
      const temp = [...prev];
      for (let item of temp) {
        if (item.id === id) {
          item.value = value;
          break;
        }
      }
      return temp;
    });
  }, []);

  return (
    <CreateGroupFormWrapper>
      <CreateGroupFormContainer>
        <CreateGroupInputContainers>
          <InputsContainer>
            {inputs.map((item) => (
              <MyInput
                onChange={(e) => {
                  handleInputChange(item.id, e.target.value);
                }}
                label={item.title}
                key={item.id}
                value={item.value}
                disabled={createGroupLoading}
                inputMode={item.inputMode}
                integer={item.integer}
                unsigned={item.unsigned}
                zerofill={item.zerofill}
              />
            ))}
          </InputsContainer>
        </CreateGroupInputContainers>
      </CreateGroupFormContainer>
      <ButtonsContainer>
        <MyButton
          type="submit"
          loading={createGroupLoading.toString()}
          disabled={createGroupLoading}
          text="Сохранить"
          onClick={(e) => {
            e.preventDefault();
            const groupData = {};
            inputs.forEach((item) => {
              groupData[item.name] = item.value;
            });
            createNewGroup(
              setCreateGroupLoading,
              token,
              {
                ...groupData,
              },
              () => {
                navigate(0);
              }
            );
          }}
        />
      </ButtonsContainer>
    </CreateGroupFormWrapper>
  );
}

export default CreateGroupForm;
