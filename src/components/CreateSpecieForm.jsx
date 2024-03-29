import { useState, useMemo } from "react";
import MyButton from "./MyButton";
import styled from "styled-components";
import Select from "./Select";
import { createNewSpecie } from "../api/GoodsApi";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";

const { SPECIE_STATUSES } = config;

const CreateSpecieFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 800px;
  height: 70vh;
  max-height: 70vh;
`;
const CreateSpecieFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const CreateSpecieInputContainers = styled.div`
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

function CreateSpecieForm({
  createSpecieLoading,
  setCreateSpecieLoading,
  good_id,
  next,
}) {
  const { token } = useAuth();
  const [status, setStatus] = useState("available");

  const options = useMemo(() => {
    return Object.keys(SPECIE_STATUSES).map((key) => ({
      id: key,
      name: SPECIE_STATUSES[key],
    }));
  }, []);

  return (
    <CreateSpecieFormWrapper>
      <CreateSpecieFormContainer>
        <CreateSpecieInputContainers>
          <InputsContainer>
            <Select
              disabled={true}
              label="Статус"
              value={status}
              setValue={setStatus}
              loading={createSpecieLoading}
              defaultOptions={[]}
              options={options}
            />
          </InputsContainer>
        </CreateSpecieInputContainers>
      </CreateSpecieFormContainer>
      <ButtonsContainer>
        <MyButton
          type="submit"
          loading={createSpecieLoading.toString()}
          disabled={createSpecieLoading}
          text="Сохранить"
          onClick={(e) => {
            e.preventDefault();
            createNewSpecie(
              setCreateSpecieLoading,
              token,
              {
                status,
                good_id,
              },
              next
            );
          }}
        />
      </ButtonsContainer>
    </CreateSpecieFormWrapper>
  );
}

export default CreateSpecieForm;
