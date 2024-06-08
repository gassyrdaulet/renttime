import cl from "../../styles/Logo.module.css";

function Logo({ onClick = () => {} }) {
  return (
    <div
      onClick={onClick}
      title="RentTime - автоматизация арендного бизнеса"
      className={cl.mainWrapper}
    >
      <p className={cl.firstWord}>Rent</p>
      <p className={cl.secondWord}>Time</p>
      <p style={{ fontSize: 9 }}>Главная</p>
    </div>
  );
}

export default Logo;
