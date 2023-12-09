import { useState, useCallback, useMemo } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import styled from "styled-components";
import ImagePicker from "./ImagePicker";
import Select from "./Select";
import { createNewGood } from "../api/GoodsApi";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CreateGoodFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 800px;
  height: 70vh;
  max-height: 70vh;
`;
const CreateGoodFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const CreateGoodInputContainers = styled.div`
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

function CreateGoodForm({
  createGoodLoading,
  setCreateGoodLoading,
  groups,
  groupsLoading,
}) {
  const [inputs, setInputs] = useState([
    { id: 0, title: "Название", value: "", name: "name", inputMode: "text" },
    {
      id: 1,
      title: "Стоимость за минуту",
      value: "0",
      name: "price_per_minute",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 2,
      title: "Стоимость за час",
      value: "0",
      name: "price_per_hour",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 3,
      title: "Стоимость за сутки",
      value: "0",
      name: "price_per_day",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 4,
      title: "Стоимость за месяц",
      value: "0",
      name: "price_per_month",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 5,
      title: "Стоимость возмещения",
      value: "0",
      name: "compensation_price",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
  ]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(-1);
  const { token } = useAuth();
  const navigate = useNavigate();

  const defaultOptions = useMemo(
    () => [{ id: -1, name: "Оставить без группы" }],
    []
  );

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
    <CreateGoodFormWrapper>
      <CreateGoodFormContainer>
        <CreateGoodInputContainers>
          <InputsContainer>
            {inputs.map((item) => (
              <MyInput
                onChange={(e) => {
                  handleInputChange(item.id, e.target.value);
                }}
                label={item.title}
                key={item.id}
                value={item.value}
                disabled={createGoodLoading}
                inputMode={item.inputMode}
                integer={item.integer}
                unsigned={item.unsigned}
                zerofill={item.zerofill}
              />
            ))}
            <Select
              label="Группа"
              value={selectedGroup}
              setValue={(v) => setSelectedGroup(parseInt(v))}
              loading={groupsLoading || createGoodLoading}
              defaultOptions={defaultOptions}
              options={groups}
            />
          </InputsContainer>
          <InputsContainer>
            <ImagePicker
              disabled={createGoodLoading}
              label="Выберите изображение"
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              maxSize={1000}
            />
          </InputsContainer>
        </CreateGoodInputContainers>
      </CreateGoodFormContainer>
      <ButtonsContainer>
        <MyButton
          type="submit"
          loading={createGoodLoading.toString()}
          disabled={createGoodLoading}
          text="Сохранить"
          onClick={(e) => {
            e.preventDefault();
            const goodData = {};
            inputs.forEach((item) => {
              goodData[item.name] = item.value;
            });
            createNewGood(
              setCreateGoodLoading,
              token,
              {
                ...goodData,
                group: selectedGroup,
              },
              selectedImage,
              () => {
                navigate(0);
              }
            );
          }}
        />
      </ButtonsContainer>
    </CreateGoodFormWrapper>
  );
}

export default CreateGoodForm;
