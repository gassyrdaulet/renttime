import { useEffect, useState, useMemo, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import { getAllGoods, getAllGroups } from "../api/GoodsApi";
import ContainerLayout from "../components/ContainerLayout";
import { FaPlusSquare, FaFolderPlus } from "react-icons/fa";
import cl from "../styles/Goods.module.css";
import CredButtons from "../components/CredButtons";
import ControlPanelButtons from "../components/ControlPanelButtons";
import Groups from "../components/Groups";
import GoodItem from "../components/GoodItem";
import Modal from "../components/Modal";
import CreateGoodForm from "../components/CreateGoodForm";
import CreateGroupForm from "../components/CreateGroupForm";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import Select from "../components/Select";
import { BsFilterSquareFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";

function Goods() {
  const [goodsLoading, setGoodsLoading] = useState(true);
  const [createGoodLoading, setCreateGoodLoading] = useState(false);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [goods, setGoods] = useState([]);
  const [createGoodModal, setCreateGoodModal] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [filterSortModal, setFilterSortModal] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(-2);
  const [searchInputText, setSearchInputText] = useState("");
  const [confirmedSearchText, setConfirmedSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("pageSize")
      ? parseInt(localStorage.getItem("pageSize"))
      : 10
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") ? localStorage.getItem("sortBy") : "name"
  );
  const { token } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const credButtons = [
    {
      id: 0,
      title: "Новая карточка",
      icon: <FaPlusSquare color="#0F9D58" size={20} />,
      onClick: () => {
        setCreateGoodModal(true);
      },
    },
    {
      id: 1,
      title: "Новая группа",
      icon: <FaFolderPlus color="#2786f2" size={20} />,
      onClick: () => {
        setCreateGroupModal(true);
      },
    },
  ];

  const controlPanelButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Фильтры и сортировка",
        icon: <BsFilterSquareFill size={20} />,
        onClick: () => {
          setFilterSortModal(true);
        },
      },
    ],
    []
  );

  const pageSizes = useMemo(
    () => [
      { id: 10, name: 10 },
      { id: 12, name: 12 },
      { id: 24, name: 24 },
      { id: 36, name: 36 },
      { id: 50, name: 50 },
    ],
    []
  );

  const sortByOptions = useMemo(() => [{ id: "name", name: "По имени" }], []);

  const fetchData = useCallback(() => {
    const params = {
      page,
      pageSize,
      sortBy: "name",
      sortOrder: "ASC",
      group_id: selectedGroup,
    };
    if (confirmedSearchText) {
      params.filter = confirmedSearchText;
    }
    getAllGoods(
      setGoodsLoading,
      token,
      setGoods,
      params,
      setTotalCount,
      setFilteredTotalCount
    );
    getAllGroups(setGroupsLoading, token, setGroups);
  }, [token, page, pageSize, confirmedSearchText, selectedGroup]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchInputText === "") {
      setConfirmedSearchText("");
    }
  }, [searchInputText]);

  useEffect(() => {
    setPage(1);
  }, [selectedGroup, confirmedSearchText, pageSize]);

  useEffect(() => {
    navigate(`/cards/${selectedGroup}/${page}`);
  }, [page, selectedGroup, navigate]);

  useEffect(() => {
    setPage(parseInt(params.page));
    setSelectedGroup(parseInt(params.group));
  }, [params.page, params.group]);

  const leftContent = (
    <div>
      <CredButtons credButtons={credButtons} />
      <Groups
        defaultOptions={[
          { id: -2, name: `Все карточки (${totalCount})` },
          { id: -1, name: "Карточки без группы" },
        ]}
        switchLoading={goodsLoading}
        setSelectedGroup={setSelectedGroup}
        selectedGroup={selectedGroup}
        groupsLoading={groupsLoading}
        groups={groups}
      />
    </div>
  );

  const mainContent = (
    <div className={cl.MainContent}>
      <div className={cl.SortFilterPanel}>
        <div className={cl.Sorts}>
          <div className={cl.TotalInfo}>
            {confirmedSearchText ? (
              <p>{`Результаты по запросу: "${confirmedSearchText}"`}</p>
            ) : (
              <p>{`Пустой запрос`}</p>
            )}
            <p>{`Найдено результатов: ${filteredTotalCount}`}</p>
          </div>
          <ControlPanelButtons controlPanelButtons={controlPanelButtons} />
        </div>
        <Pagination
          loading={goodsLoading}
          currentPage={page}
          totalPages={Math.ceil(filteredTotalCount / pageSize)}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </div>
      {goodsLoading ? (
        <div className="LoadingWrapper2">
          <Loading which="gray" />
        </div>
      ) : goods.length === 0 ? (
        <div className="LoadingWrapper2">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className={cl.Goods}>
          {goods.map((item, index) => (
            <GoodItem
              index={index + 1 + pageSize * (page - 1)}
              onClick={() =>
                navigate(`/cards/${selectedGroup}/${page}/${item.id}`)
              }
              key={item.id}
              goodItem={item}
            />
          ))}
        </div>
      )}
      <Modal
        onlyByClose={true}
        title="Создание новой карточки"
        modalVisible={createGoodModal}
        setModalVisible={setCreateGoodModal}
        noEscape={createGoodLoading}
      >
        <CreateGoodForm
          groupsLoading={groupsLoading}
          createGoodLoading={createGoodLoading}
          setCreateGoodLoading={setCreateGoodLoading}
          groups={groups}
          next={() => {
            setCreateGoodModal(false);
            fetchData();
          }}
        />
      </Modal>
      <Modal
        onlyByClose={true}
        title="Создание новой карточки"
        modalVisible={createGroupModal}
        setModalVisible={setCreateGroupModal}
        noEscape={createGroupLoading}
      >
        <CreateGroupForm
          createGroupLoading={createGroupLoading}
          setCreateGroupLoading={setCreateGroupLoading}
        />
      </Modal>
      <Modal
        title="Фильтры и сортировка"
        modalVisible={filterSortModal}
        setModalVisible={setFilterSortModal}
      >
        <Select
          defaultOptions={[]}
          value={pageSize}
          label="Элементов на странице"
          options={pageSizes}
          loading={goodsLoading}
          setValue={(v) => {
            setPageSize(v);
            localStorage.setItem("pageSize", String(v));
          }}
        />
        <Select
          defaultOptions={[]}
          value={sortBy}
          label="Сортировать по"
          options={sortByOptions}
          loading={goodsLoading}
          setValue={(v) => {
            setSortBy(v);
            localStorage.setItem("sortBy", String(v));
          }}
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
      onClickSearchButton={() => setConfirmedSearchText(searchInputText)}
      searchButtonLoading={goodsLoading}
      searchInputMaxLetters={50}
    />
  );
}

export default Goods;
