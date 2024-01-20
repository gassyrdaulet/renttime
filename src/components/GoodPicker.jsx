import Modal from "./Modal";
import MyButton from "./MyButton";
import { BiSolidChevronLeft, BiPlusCircle, BiSearch } from "react-icons/bi";
import styled from "styled-components";
import {
  getAllGoods,
  getAllGroups,
  getSpecies,
  searchSpecie,
} from "../api/GoodsApi";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import useAuth from "../hooks/useAuth";
import SearchInput from "./SearchInput";
import Loading from "./Loading";
import Pagination from "./Pagination";
import GoodItem from "./GoodItem";
import SpecieItem from "./SpecieItem";
import SpecieWithImage from "./SpecieWithImage";
import VolumeSlider from "./Volume";
import { FaTrash } from "react-icons/fa";
import config from "../config/config.json";
import AsyncSelect from "./AsyncSelect";
import debounce from "lodash.debounce";

const { SPECIE_STATUSES_AVAILABLE, SPECIE_STATUSES } = config;
const pageSize = 10;

const AddGoodButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const AddGoodButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const AddGoodButtonText = styled.p`
  vertical-align: center;
`;
const SpeciesWithImages = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  padding: 10px;
  align-items: center;
  border: 1px solid #ffd700;
  border-radius: 5px;
  &::-webkit-scrollbar {
    height: 0;
  }
  margin-bottom: 10px;
`;
const SearchWrapper = styled.div`
  width: 70vw;
  max-width: 500px;
  margin: 0 20px;
`;
const SpecieWithImageWrapper = styled.div`
  display: flex;
  min-width: 200px;
  max-width: 200px;
  margin: 0 10px;
  min-height: 240px;
`;
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;
const AddGoodWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  max-width: 700px;
  min-height: 80vh;
  max-height: 80vh;
  user-select: none;
`;
const AddGoodRow = styled.div`
  display: flex;
  margin-top: 15px;
  justify-content: space-between;
`;
const AddGoodBackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const AddGoodBackButtonText = styled.p`
  text-align: center;
`;
const AddGoodSearch = styled.form`
  display: flex;
  align-items: center;
  margin: 5px;
`;
const Species = styled.div`
  margin-top: 15px;
  display: grid;
  overflow-y: auto;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  row-gap: 15px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 10px;
    column-gap: 10px;
  }
  @media (max-width: 390px) {
    grid-template-columns: repeat(1, 1fr);
    row-gap: 10px;
  }
`;
const ItemsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(
    4,
    ${(props) => (props.style.group ? "1fr" : "140px")}
  );
  justify-content: ${(props) => (props.style.group ? "" : "space-around")};
  justify-items: ${(props) => (props.style.group ? "" : "")};
  row-gap: 25px;
  column-gap: 10px;
  margin-top: 15px;
  max-height: 70vh;
  overflow-y: auto;
  @media (max-width: 750px) {
    grid-template-columns: repeat(
      3,
      ${(props) => (props.style.group ? "1fr" : "140px")}
    );
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(
      2,
      ${(props) => (props.style.group ? "1fr" : "140px")}
    );
  }
`;
const Group = styled.p`
  user-select: none;
  cursor: pointer;
  padding: 15px 10px;
  margin: 5px;
  border-radius: 10px;
  border: 2px solid #3480eb;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
  font-size: 13px;
`;
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
`;
const PaginationWrapper = styled.div`
  margin-top: 15px;
`;

function GoodPicker({ tariff, pickedGoods, setPickedGoods, disabled }) {
  const [addGoodModal, setAddGoodModal] = useState(false);
  const [addGoodByCodeModal, setAddGoodByCodeModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [fetchedGoods, setFetchedGoods] = useState([]);
  const [fetchedSpecies, setFetchedSpecies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [confirmedSearchText, setConfirmedSearchText] = useState("");
  const [AddGoodModalTitle, setAddGoodModalTitle] = useState("Выберите товары");
  const [loading, setLoading] = useState(false);
  const [searchSpecieLoading, setSearchSpecieLoading] = useState(false);
  const [species, setSpecies] = useState([]);
  const [showGroups, setShowGroups] = useState(true);
  const [showGoods, setShowGoods] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGood, setSelectedGood] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [page, setPage] = useState(1);
  const speciesWithImagesContainer = useRef(null);

  const { token } = useAuth();

  const defaultGroups = useMemo(
    () => [
      { id: -2, name: "Все товары" },
      { id: -1, name: "Товары без группы" },
    ],
    []
  );

  const markedGoods = useMemo(() => {
    const result = {};
    pickedGoods.forEach((item) => {
      result[item.good.id] = true;
    });
    return result;
  }, [pickedGoods]);

  const markedSpecies = useMemo(() => {
    const result = {};
    pickedGoods.forEach((item) => {
      result[item.specie.id] = true;
    });
    return result;
  }, [pickedGoods]);

  const handleAddGoodBackButton = useCallback(() => {
    if (selectedGood) {
      setSelectedGood(null);
      return;
    }
    setSelectedGroup(null);
  }, [selectedGood]);

  const handleSearchButton = useCallback(() => {
    if (!selectedGroup) {
      setSelectedGroup({ id: -2, name: "Все товары" });
    }
    if (selectedGood) {
      setSelectedGood(null);
    }
    setConfirmedSearchText(searchText);
  }, [searchText, selectedGood, selectedGroup]);

  const addGood = useCallback(
    (good) => {
      if (!SPECIE_STATUSES_AVAILABLE?.[good.specie.status]) {
        return;
      }
      setPickedGoods((prev) => {
        const temp = [...prev];
        for (let tempItem of temp) {
          if (tempItem.specie.id === good.specie.id) {
            const newTemp = temp.filter(
              (item) => item.specie.id !== good.specie.id
            );
            return newTemp;
          }
        }
        temp.push(good);
        return temp;
      });
    },
    [setPickedGoods]
  );

  const handleOnSpecieClick = useCallback(
    (specie) => {
      addGood({ specie, good: selectedGood });
    },
    [selectedGood, addGood]
  );

  const handleOnAsyncResultClick = useCallback(
    (specie) => {
      addGood({ specie, good: specie.goodInfo });
    },
    [addGood]
  );

  const handleDeletePickedGood = useCallback(
    (pickedGood) => {
      setPickedGoods((prev) => {
        const temp = [...prev].filter(
          (item) => pickedGood.specie?.id !== item.specie?.id
        );
        return temp;
      });
    },
    [setPickedGoods]
  );

  const fetchGoods = useCallback(() => {
    if (token) {
      const selectParams = {
        page,
        pageSize,
        sortBy: "name",
        sortOrder: "ASC",
        group_id: selectedGroup.id ? selectedGroup.id : -2,
      };
      if (confirmedSearchText) {
        selectParams.filter = confirmedSearchText;
      }
      getAllGoods(
        setLoading,
        token,
        setFetchedGoods,
        selectParams,
        setTotalCount,
        setFilteredTotalCount
      );
    }
  }, [token, page, selectedGroup, confirmedSearchText]);

  const handleScroll = useCallback((e) => {
    setScrollX(() => {
      const totalScrollWidth =
        speciesWithImagesContainer.current.scrollWidth -
        speciesWithImagesContainer.current.clientWidth;
      const scrollXValue = (e.target.scrollLeft / totalScrollWidth) * 100;
      return Math.ceil(scrollXValue);
    });
  }, []);

  useEffect(() => {
    if (speciesWithImagesContainer.current) {
      if (
        speciesWithImagesContainer.current.scrollWidth ===
        speciesWithImagesContainer.current.clientWidth
      ) {
        return setScrollX(0);
      }
      const totalScrollWidth =
        speciesWithImagesContainer.current.scrollWidth -
        speciesWithImagesContainer.current.clientWidth;
      const scrollToValue = (scrollX / 100) * totalScrollWidth;
      speciesWithImagesContainer.current.scrollLeft = scrollToValue;
    }
  }, [scrollX]);

  useEffect(() => {
    if (pickedGoods.length === 0) {
      return setAddGoodModalTitle("Выберите товары");
    }
    setAddGoodModalTitle(`Выбрано: ${pickedGoods.length}`);
  }, [pickedGoods]);

  useEffect(() => {
    if (token) {
      getAllGroups(setLoading, token, (data) => {
        setGroups([...defaultGroups, ...data]);
      });
    }
  }, [defaultGroups, token]);

  useEffect(() => {
    if (selectedGroup) {
      fetchGoods();
    }
  }, [selectedGroup, fetchGoods, page, confirmedSearchText]);

  useEffect(() => {
    if (selectedGood && token) {
      getSpecies(setLoading, token, setFetchedSpecies, selectedGood.id);
    }
  }, [selectedGood, token]);

  useEffect(() => {
    if (selectedGroup) {
      if (selectedGood) {
        setShowGoods(false);
        setShowSpecies(true);
        setShowGroups(false);
        return;
      }
      setShowGoods(true);
      setShowSpecies(false);
      setShowGroups(false);
    } else {
      setShowGoods(false);
      setShowSpecies(false);
      setShowGroups(true);
    }
  }, [selectedGroup, selectedGood]);

  useEffect(() => {
    setSearchText(confirmedSearchText);
  }, [confirmedSearchText]);

  useEffect(() => {
    if (searchText === "") {
      setConfirmedSearchText("");
    }
  }, [searchText]);

  const debouncedSearchSpecie = debounce((filter) => {
    if (!filter) {
      setSpecies([]);
      return;
    }
    searchSpecie(setSearchSpecieLoading, token, filter, setSpecies);
  }, 300);

  const formattedSpecies = useMemo(
    () =>
      species.map((item) => {
        let alreadyThere = false;
        for (let pickedGood of pickedGoods) {
          if (pickedGood.specie.id === item.id) {
            alreadyThere = true;
            break;
          }
        }
        return {
          id: item.id,
          value: `${item.goodInfo.id}/${item.id} - ${item.goodInfo.name} ${
            SPECIE_STATUSES[item.status]
          } - (ID: ${item.id})`,
          specie: item,
          disabled: !SPECIE_STATUSES_AVAILABLE?.[item.status] || alreadyThere,
        };
      }),
    [species, pickedGoods]
  );

  return (
    <div>
      <VolumeSlider
        volume={scrollX}
        onChange={(e) => setScrollX(e.target.value)}
      />
      <SpeciesWithImages
        ref={speciesWithImagesContainer}
        onScroll={handleScroll}
      >
        {!setPickedGoods ? (
          pickedGoods.length === 0 && (
            <SpecieWithImageWrapper></SpecieWithImageWrapper>
          )
        ) : (
          <SpecieWithImageWrapper>
            <AddGoodButtons>
              <MyButton
                onClick={() => {
                  setAddGoodModal(true);
                }}
                disabled={loading || addGoodModal || disabled}
                margin="0"
                text={
                  <AddGoodButton>
                    <IconContainer>
                      <BiPlusCircle size={30} />
                    </IconContainer>
                    <AddGoodButtonText>
                      Добавить товар через модальное окно
                    </AddGoodButtonText>
                  </AddGoodButton>
                }
              />
              <p>или</p>
              <MyButton
                onClick={() => {
                  setAddGoodByCodeModal(true);
                }}
                disabled={disabled}
                margin="0"
                text={
                  <AddGoodButton>
                    <IconContainer>
                      <BiPlusCircle size={30} />
                    </IconContainer>
                    <AddGoodButtonText>
                      Добавить товар по инвентарьному коду
                    </AddGoodButtonText>
                  </AddGoodButton>
                }
              />
            </AddGoodButtons>
          </SpecieWithImageWrapper>
        )}
        {pickedGoods.map((item) => (
          <SpecieWithImageWrapper key={item.specie.id}>
            <SpecieWithImage
              tariff={tariff}
              icon={setPickedGoods && <FaTrash color="#d4422f" size={15} />}
              onClickIcon={() => handleDeletePickedGood(item)}
              itemInfo={item}
            />
          </SpecieWithImageWrapper>
        ))}
      </SpeciesWithImages>

      <Modal
        title={AddGoodModalTitle}
        modalVisible={addGoodModal}
        setModalVisible={setAddGoodModal}
      >
        <AddGoodWrapper>
          <div>
            <AddGoodSearch>
              <SearchInput
                value={searchText}
                setValue={setSearchText}
                borderBRRadius="0"
                borderTRRadius="0"
                maxLetters={50}
              />
              <MyButton
                type="submit"
                disabled={loading}
                text={<BiSearch size={18} />}
                margin="0"
                borderBLRadius="0"
                borderTLRadius="0"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchButton();
                }}
              />
            </AddGoodSearch>
          </div>
          {(showGoods || showSpecies) && (
            <AddGoodRow>
              <AddGoodBackButton>
                <BiSolidChevronLeft size={20} />
                <AddGoodBackButtonText onClick={handleAddGoodBackButton}>
                  Назад
                </AddGoodBackButtonText>
              </AddGoodBackButton>
              <AddGoodBackButtonText>
                {showGoods && selectedGroup?.name + ` (${totalCount})`}
                {showSpecies && selectedGood?.name}
              </AddGoodBackButtonText>
            </AddGoodRow>
          )}
          {showGoods && (
            <PaginationWrapper>
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(filteredTotalCount / pageSize)}
                onPageChange={(p) => setPage(p)}
                loading={loading}
              />
            </PaginationWrapper>
          )}
          {!loading && showGoods && fetchedGoods.length === 0 && (
            <LoadingWrapper>
              <p>Ничего не найдено</p>
            </LoadingWrapper>
          )}
          {!loading && showSpecies && fetchedSpecies.length === 0 && (
            <LoadingWrapper>
              <p>Ничего не найдено</p>
            </LoadingWrapper>
          )}
          {!loading && showSpecies && (
            <Species>
              {fetchedSpecies.map((item) => (
                <SpecieItem
                  code={`${selectedGood.id}/${item.id}`}
                  marked={{
                    isMarked: markedSpecies[item.id],
                    markColor: "#ffd700",
                  }}
                  onClick={() => handleOnSpecieClick(item)}
                  specieItem={item}
                  key={item.id}
                />
              ))}
            </Species>
          )}
          {loading ? (
            <LoadingWrapper>
              <Loading which="gray" />
            </LoadingWrapper>
          ) : (
            <ItemsWrapper style={{ group: showGroups }}>
              {showGroups &&
                groups.map((item) => (
                  <Group onClick={() => setSelectedGroup(item)} key={item.id}>
                    {item?.name} {item.id > 0 && `(id:${item.id})`}
                  </Group>
                ))}
              {showGoods &&
                fetchedGoods.map((item) => (
                  <GoodItem
                    marked={{
                      isMarked: markedGoods[item.id],
                      markColor: "#ffd700",
                    }}
                    onClick={() => setSelectedGood(item)}
                    goodItem={item}
                    key={item.id}
                  />
                ))}
            </ItemsWrapper>
          )}
        </AddGoodWrapper>
      </Modal>
      <Modal
        title="Добавить товар"
        modalVisible={addGoodByCodeModal}
        setModalVisible={setAddGoodByCodeModal}
        onlyByClose={true}
      >
        <SearchWrapper>
          <AsyncSelect
            disabled={false}
            loading={searchSpecieLoading}
            placeholder="Поиск единиц..."
            selectedOption={0}
            setSelectedOption={(i) => {
              handleOnAsyncResultClick(i.specie);
              setAddGoodByCodeModal(false);
            }}
            onChangeText={debouncedSearchSpecie}
            options={formattedSpecies}
          />
        </SearchWrapper>
      </Modal>
    </div>
  );
}

export default GoodPicker;
