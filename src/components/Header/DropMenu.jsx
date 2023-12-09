import { useEffect, useRef, useState } from "react";
import cl from "../../styles/DropMenus.module.css";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

function DropMenu({ isActive, buttonItem, setInvisible, mainContainerRef }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useOutsideAlerter(ref, () => {
    setInvisible();
  });

  useEffect(() => {
    if (isActive) {
      const containerRect = ref.current.getBoundingClientRect();
      const mainContainerRect =
        mainContainerRef.current.getBoundingClientRect();
      if (containerRect.right - mainContainerRect.right > -10) {
        const newOffset = mainContainerRect.right - containerRect.right - 10;
        setOffset(Math.ceil(newOffset));
        return;
      } else {
        setOffset(0);
      }
      if (containerRect.left < 10) {
        const newOffset = Math.abs(containerRect.left) + 10;
        setOffset(Math.ceil(newOffset));
        return;
      } else {
        setOffset(0);
      }
    } else {
      setOffset(0);
    }
  }, [isActive, mainContainerRef]);

  return (
    isActive && (
      <div
        style={{ transform: `translateX(${offset}px)` }}
        ref={ref}
        className={cl.DropMenu}
      >
        {buttonItem.menuItems &&
          buttonItem.menuItems.map((item, index) => (
            <div
              className={
                cl.DropMenuItem +
                " " +
                (buttonItem.menuItems.length === index + 1 && cl.LastItem)
              }
              onClick={item.onClick}
              key={item.id}
            >
              <div className={cl.IconWrapper}>{item.icon}</div>
              <p>{item.name}</p>
            </div>
          ))}
      </div>
    )
  );
}

export default DropMenu;
