import { logout } from "../../api/AuthApi";
import cl from "../../styles/Header.module.css";
import Logo from "./Logo";
import useAuth from "../../hooks/useAuth";
import {
  FaClipboardList,
  FaShoppingCart,
  FaTools,
  FaListAlt,
  FaUsers,
  FaUserCog,
  FaCashRegister,
  FaDoorOpen,
  FaCartPlus,
  FaListOl,
} from "react-icons/fa";
import { GoTriangleDown } from "react-icons/go";
import Loading from "../Loading";
import { useState, useRef, useMemo } from "react";
import Modal from "../Modal";
import MyButton from "../MyButton";
import DropMenus from "./DropMenus";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BiCalendarAlt, BiCar } from "react-icons/bi";

function Header() {
  const { setIsAuth, setToken } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [activeDropMenu, setActiveDropMenu] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const div1 = useRef(null);
  const div2 = useRef(null);

  // const contactsItemAnimation = useMemo(
  //   () => ({
  //     hidden: {
  //       scale: 0,
  //       opacity: 0,
  //     },
  //     visible: (custom) => ({
  //       scale: 1,
  //       opacity: 1,
  //       transition: { delay: custom * 0.08 },
  //     }),
  //   }),
  //   []
  // );

  const buttons = useMemo(
    () => [
      {
        name: "ЗАЯВКИ",
        icon: <FaClipboardList />,
        id: 1,
        onClick: () => navigate("/orders/0/1"),
        path: "/orders",
      },
      {
        name: "ТОВАРЫ",
        icon: <FaShoppingCart />,
        id: 2,
        onClick: () => setActiveDropMenu(2),
        menuItems: [
          {
            id: 0,
            icon: <FaCartPlus />,
            name: "Все карточки",
            path: "/goods/cards",
            onClick: () => navigate("/goods/cards/-2/1"),
          },
          {
            id: 1,
            icon: <FaListOl />,
            name: "Все единицы",
            path: "/goods/species",
            onClick: () => navigate("/goods/species/all/1"),
          },
        ],
        path: "/goods",
      },
      {
        name: "ДОСТАВКИ",
        icon: <BiCar />,
        id: 3,
        onClick: () => navigate("/deliveries/new/1"),
        path: "/deliveries",
      },
      {
        name: "БРОНЬ",
        icon: <BiCalendarAlt />,
        id: 12,
        onClick: () => {},
        path: "/booking",
      },
      {
        name: "СМЕНЫ",
        icon: <FaCashRegister />,
        id: 4,
        onClick: () => navigate("/workshifts/1"),
        path: "/workshifts/",
      },
      {
        name: "КЛИЕНТЫ",
        icon: <FaUsers />,
        id: 5,
        onClick: () => navigate("/clients/1"),
        path: "/clients",
      },
      {
        name: "ОТЧЕТЫ",
        icon: <FaListAlt />,
        id: 6,
        menuItems: [
          {
            id: 1,
            icon: <FaUsers />,
            name: "Отчет по клиентам",
            path: "/summaries/clients",
            onClick: () => navigate("/summaries/clients"),
          },
          {
            id: 2,
            icon: <FaShoppingCart />,
            name: "ABC анализ",
            path: "/summaries/ABC",
            onClick: () => navigate("/summaries/ABC"),
          },
          {
            id: 3,
            icon: <FaShoppingCart />,
            name: "Отчет по доходам",
            path: "/summaries/income",
            onClick: () => navigate("/summaries/income"),
          },
        ],
        path: "/summaries",
        onClick: () => setActiveDropMenu(6),
      },
      {
        name: "НАСТРОЙКИ",
        icon: <FaTools />,
        id: 7,
        onClick: () => navigate("/settings/organization"),
        path: "/settings",
      },
      {
        isLoading: logoutLoading,
        name: "АККАУНТ",
        icon: <FaUserCog />,
        id: 8,
        onClick: () => setActiveDropMenu(8),
        menuItems: [
          {
            id: 0,
            name: "Выход из аккаунта",
            icon: <FaDoorOpen />,
            path: "",
            onClick: () => {
              setLogoutModal(true);
            },
          },
        ],
      },
    ],
    [logoutLoading, navigate]
  );

  const onScrollDiv2 = () => {
    div2.current.scrollLeft = div1.current.scrollLeft;
  };

  return (
    <div className={cl.HeaderContainer}>
      <div
        ref={div1}
        className={cl.MainWrapper}
        onScroll={(e) => setScrollLeft(e.target.scrollLeft)}
      >
        <div className={cl.SecondaryWrapper}>
          <Logo onClick={() => navigate("/main")} />
          {buttons.map((item) => {
            return (
              <motion.div
                // variants={contactsItemAnimation}
                // initial="hidden"
                // animate={"visible"}
                custom={item.id}
                key={item.id}
                className={
                  cl.Button +
                  " " +
                  ((location.pathname.startsWith(item.path) ||
                    activeDropMenu === item.id) &&
                    cl.ButtonSelected)
                }
                onClick={() => {
                  if (!item.isLoading && item.onClick) item.onClick();
                }}
              >
                {item.isLoading ? (
                  <div className={cl.ButtonLoading}>
                    <Loading which="small" />
                  </div>
                ) : (
                  item.icon
                )}
                <div className={cl.ButtonName}>
                  <p>{item.name}</p>
                  {item.menuItems && <GoTriangleDown />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <DropMenus
        scrollRef={div2}
        onScroll={onScrollDiv2}
        scrollLeft={scrollLeft}
        buttons={buttons}
        location={location}
        activeDropMenu={activeDropMenu}
        setInvisible={() => setActiveDropMenu(0)}
      />
      <Modal
        title="Подтвердите действие"
        modalVisible={logoutModal}
        setModalVisible={setLogoutModal}
        noEscape={logoutLoading}
      >
        <p>Вы действительно хотите выйти из аккаунта?</p>
        <div className={"ConfirmButtonsContainer"}>
          <MyButton
            text="Нет"
            color={{ default: "#f45e42", dark: "#e84e35" }}
            disabled={logoutLoading}
            onClick={() => {
              setLogoutModal(false);
            }}
          />
          <MyButton
            text="Да"
            color={{ default: "#85c442", dark: "#7ab835" }}
            disabled={logoutLoading}
            onClick={() => {
              logout(setLogoutLoading, setIsAuth, setToken);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Header;
