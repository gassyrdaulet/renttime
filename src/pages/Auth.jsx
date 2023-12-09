import { useState } from "react";
import { loginWithEmail, loginWithGoogle, resetPassword } from "../api/AuthApi";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import cl from "../styles/Auth.module.css";
import MyInput from "../components/MyInput";
import BlueLinkButton from "../components/BlueLinkButton";
import MyButton from "../components/MyButton";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Modal from "../components/Modal";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { setIsAuth } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={cl.AuthWrapper}>
      <div className={"Window " + cl.Auth}>
        <p className={cl.AuthTitle}>Войдите в аккаунт</p>
        <form className={cl.LoginForm} action="submit">
          <MyInput
            label="E-mail"
            disabled={isLoginLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
          />
          <MyInput
            label="Пароль"
            disabled={isLoginLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={passwordHidden ? "password" : "text"}
            right={passwordHidden ? <BsEyeSlash /> : <BsEye />}
            onClickRight={() => {
              setPasswordHidden(!passwordHidden);
            }}
          />
          <BlueLinkButton
            text="Забыли пароль?"
            onClick={(e) => {
              e.preventDefault();
              setResetPasswordModal(true);
            }}
          />
          <MyButton
            text="Войти"
            color={{ default: "#0F9D58", dark: "#0A8041" }}
            type="submit"
            disabled={isLoginLoading}
            onClick={(e) => {
              e.preventDefault();
              loginWithEmail(setIsLoginLoading, email, password, setIsAuth);
            }}
          />
          <MyButton
            text={
              <span>
                <p>
                  Войти через <span className={cl.GoogleText}>Google</span>
                </p>
              </span>
            }
            color={{ default: "#4285f4", dark: "#357ae8" }}
            disabled={isLoginLoading}
            onClick={() => loginWithGoogle(setIsLoginLoading, setIsAuth)}
          />
        </form>
        <MyButton
          text="Зарегистрироваться"
          color={{ default: "#4285f4", dark: "#357ae8" }}
          disabled={isLoginLoading}
          onClick={() => navigate("/registration")}
        />
      </div>
      <Modal
        noEscape={isLoginLoading}
        modalVisible={resetPasswordModal}
        setModalVisible={setResetPasswordModal}
        title="Восстановление пароля"
      >
        <form className={cl.LoginForm} action="submit">
          <MyInput
            label="E-mail"
            disabled={isLoginLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
          />
          <MyButton
            text="Сбросить пароль"
            color={{ default: "#0F9D58", dark: "#0A8041" }}
            type="submit"
            disabled={isLoginLoading}
            onClick={(e) => {
              e.preventDefault();
              resetPassword(setIsLoginLoading, email, () =>
                setResetPasswordModal(false)
              );
            }}
          />
        </form>
      </Modal>
    </div>
  );
}

export default Auth;
