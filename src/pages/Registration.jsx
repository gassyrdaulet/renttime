import { useState, useCallback } from "react";
import { registration, signUpWithGoogle } from "../api/AuthApi";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import cl from "../styles/Auth.module.css";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import BlueLinkButton from "../components/BlueLinkButton";
import { BiSolidChevronLeft } from "react-icons/bi";

function Registration() {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputs, setInputs] = useState([
    { id: "name", value: "", title: "Имя *", max: 50 },
    { id: "second_name", value: "", title: "Фамилия *", max: 50 },
    { id: "father_name", value: "", title: "Отчество", max: 50 },
    { id: "cellphone", value: "", title: "Номер телефона *", max: 50 },
  ]);
  const [isRegistrationLoading, setRegistrationLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuth } = useAuth();

  const handleChangeInputs = useCallback((id, v) => {
    setInputs((prev) => {
      const temp = [...prev];
      for (let item of temp) {
        if (item.id === id) {
          item.value = v;
          return temp;
        }
      }
      return temp;
    });
  }, []);

  return (
    <div className={cl.AuthWrapper}>
      <div className={"Window " + cl.Auth}>
        <div className={cl.GoBack} onClick={() => navigate("/login")}>
          <div className={cl.IconContainer}>
            <BiSolidChevronLeft size={20} />
          </div>
          <p>Войти в аккаунт</p>
        </div>
        <p className={cl.AuthTitle}>Страница регистрации</p>
        <form className={cl.LoginForm} autoComplete="off" action="submit">
          {inputs.map((item) => (
            <MyInput
              max={item.max}
              value={item.value}
              onChange={(e) => handleChangeInputs(item.id, e.target.value)}
              key={item.id}
              label={item.title}
              disabled={isRegistrationLoading}
            />
          ))}
          <MyInput
            label="E-mail *"
            disabled={isRegistrationLoading}
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            type="text"
          />
          <MyInput
            label="Пароль *"
            disabled={isRegistrationLoading}
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            type={passwordHidden ? "password" : "text"}
            right={passwordHidden ? <BsEyeSlash /> : <BsEye />}
            onClickRight={() => {
              setPasswordHidden(!passwordHidden);
            }}
          />
          <BlueLinkButton
            text="Уже есть аккаунт?"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          />
          <MyButton
            text="Зарегистрироваться"
            color={{ default: "#0F9D58", dark: "#0A8041" }}
            disabled={isRegistrationLoading}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const data = {};
              inputs.forEach((item) => {
                data[item.id] = item.value;
              });
              data.email = email.toLowerCase();
              data.password = password;
              if (!data.father_name) {
                delete data.father_name;
              }
              registration(data, setRegistrationLoading, () =>
                navigate("/login")
              );
            }}
          />
          <MyButton
            text={
              <span>
                <p>
                  Регистрация через{" "}
                  <span className={cl.GoogleText}>Google</span>
                </p>
              </span>
            }
            color={{ default: "#4285f4", dark: "#357ae8" }}
            disabled={isRegistrationLoading}
            onClick={() => signUpWithGoogle(setRegistrationLoading, setIsAuth)}
          />
        </form>
      </div>
    </div>
  );
}

export default Registration;
