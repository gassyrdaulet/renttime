import cl from "../styles/CredButtons.module.css";

function CredButtons({ credButtons }) {
  return (
    <div className={cl.CredButtonsWrapper}>
      <div className={cl.CredButtons}>
        {credButtons.map((item) => (
          <div
            className={cl.CredButtonsItem}
            key={item.id}
            onClick={item.onClick}
          >
            <div className={cl.CredButtonsItemIcon}>{item.icon}</div>
            <p className={cl.CredButtonsItemTitle}>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CredButtons;
