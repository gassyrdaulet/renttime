import cl from "../../styles/Logo.module.css";

function Logo({ onClick = () => {} }) {
  return (
    <div
      onClick={onClick}
      title="RentTime - автоматизация арендного бизенса"
      className={cl.mainWrapper}
    >
      <p className={cl.firstWord}>Rent</p>
      <p className={cl.secondWord}>Time</p>
    </div>
  );
}

export default Logo;
