import { useEffect, useState, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import ContainerLayout from "../components/ContainerLayout";
import { FaPencilAlt, FaPlusSquare } from "react-icons/fa";
import CredButtons from "../components/CredButtons";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { getSpecies, getGood } from "../api/GoodsApi";
import { useParams, useNavigate } from "react-router-dom";
import CreateSpecieForm from "../components/CreateSpecieForm";
import cl from "../styles/Card.module.css";
import { BiSolidChevronLeft } from "react-icons/bi";
import ImageContainer from "../components/ImageContainer";
import SpecieItem from "../components/SpecieItem";
import config from "../config/config.json";

const { SPECIE_STATUSES_AVAILABLE } = config;

function Card() {
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [goodDataLoading, setGoodDataLoading] = useState(true);
  const [createSpecieLoading, setCreateSpecieLoading] = useState(false);
  const [species, setSpecies] = useState([]);
  const [goodData, setGoodData] = useState({});
  const [createSpecieModal, setCreateSpecieModal] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const { token } = useAuth();
  const { id } = useParams();
  const params = useParams();
  const navigate = useNavigate();
  const credButtons = [
    {
      id: 0,
      title: "Новая единица",
      icon: <FaPlusSquare color="#0F9D58" size={20} />,
      onClick: () => {
        setCreateSpecieModal(true);
      },
    },
    {
      id: 1,
      title: "Редактировать",
      icon: <FaPencilAlt color="#0F589D" size={20} />,
      onClick: () => {},
    },
  ];

  useEffect(() => {
    getSpecies(setSpeciesLoading, token, setSpecies, id);
    getGood(setGoodDataLoading, token, setGoodData, id);
  }, [id, token]);

  const filteredSpecies = useMemo(
    () =>
      species.filter((v) => {
        return (v?.code + "").includes(searchInputText);
      }),
    [species, searchInputText]
  );

  const availableCount = useMemo(() => {
    let total = 0;
    species.forEach((item) => {
      if (SPECIE_STATUSES_AVAILABLE?.[item?.status]) {
        total++;
      }
    });
    return total;
  }, [species]);

  const goodInfo = useMemo(
    () => [
      {
        title: "ID товара",
        value: goodData?.id,
      },
      {
        title: "ID группы",
        value: goodData?.group_id,
      },
      {
        title: "Стоимость компенсации",
        value: goodData?.compensation_price,
      },
      {
        title: "Стоимость за минуту",
        value: goodData?.price_per_minute,
      },
      {
        title: "Стоимость за час",
        value: goodData?.price_per_hour,
      },
      {
        title: "Стоимость за день",
        value: goodData?.price_per_day,
      },
      {
        title: "Стоимость за месяц",
        value: goodData?.price_per_month,
      },
      {
        title: "Доступное количество",
        value: availableCount,
      },
      {
        title: "Общее количество",
        value: species.length,
      },
    ],
    [goodData, species, availableCount]
  );

  const leftContent = (
    <div>
      <div
        className={cl.GoBack}
        onClick={() => navigate(`/cards/${params.group}/${params.page}`)}
      >
        <div className={cl.IconContainer}>
          <BiSolidChevronLeft size={20} />
        </div>
        <p>Назад ко всем карточкам</p>
      </div>
      <CredButtons credButtons={credButtons} />
      <div className={cl.GoodDataWrapper}>
        <p className={cl.GoodDataGoodName}>{goodData?.name}</p>
        <div className={cl.ImageWrapper}>
          <ImageContainer
            src={goodData?.photo}
            alt={goodData?.name}
            size="original"
            goodId={goodData?.id}
            width="100%"
            height="inherit"
          />
        </div>
        {goodDataLoading ? (
          <div className="LoadingWrapper">
            <Loading which="gray" />
          </div>
        ) : (
          <div className={cl.GoodData}>
            {goodInfo.map((item) => (
              <div key={item.title} className={cl.GoodDataItem}>
                <p className={cl.GoodDataItemTitle}>{item.title}</p>
                <p className={cl.GoodDataItemText}>
                  {item.value ? item.value : "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const mainContent = (
    <div className={cl.MainContent}>
      <div className={cl.Card}>
        {speciesLoading ? (
          <div className="LoadingWrapper2">
            <Loading which="gray" />
          </div>
        ) : filteredSpecies.length === 0 ? (
          <div className="LoadingWrapper2">
            <p>Ничего не найдено</p>
          </div>
        ) : (
          <div className={cl.Species}>
            {filteredSpecies.map((item) => (
              <SpecieItem specieItem={item} key={item.id} />
            ))}
          </div>
        )}
      </div>
      <Modal
        onlyByClose={true}
        title="Создание новой единицы"
        modalVisible={createSpecieModal}
        setModalVisible={setCreateSpecieModal}
        noEscape={createSpecieLoading}
      >
        <CreateSpecieForm
          createSpecieLoading={createSpecieLoading}
          setCreateSpecieLoading={setCreateSpecieLoading}
          good_id={id}
        />
      </Modal>
    </div>
  );

  return (
    <ContainerLayout
      searchInputText={searchInputText}
      setSearchInputText={setSearchInputText}
      leftContent={leftContent}
      mainContent={mainContent}
    />
  );
}

export default Card;
