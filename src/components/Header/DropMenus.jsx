import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cl from "../../styles/DropMenus.module.css";
import Logo from "./Logo";
import DropMenu from "./DropMenu";
import useAuth from "../../hooks/useAuth";

const DropMenus = ({
  scrollRef,
  buttons,
  activeDropMenu,
  setInvisible,
  onScroll,
  scrollLeft,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, y: -5 },
  };
  const modalWrapperVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
    exit: { opacity: 0 },
  };
  const { setFixed } = useAuth();

  useEffect(() => {
    try {
      scrollRef.current.scrollLeft = scrollLeft;
    } catch {}
  }, [scrollLeft, scrollRef]);

  useEffect(() => {
    if (activeDropMenu !== 0) {
      setFixed(true);
    } else {
      setFixed(false);
    }
  }, [activeDropMenu, setFixed]);

  return (
    <AnimatePresence>
      {
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalWrapperVariants}
          className={
            cl.DropMenuWrapper + " " + (activeDropMenu === 0 && cl.Invisible)
          }
        >
          <div ref={scrollRef} onScroll={onScroll} className={cl.MainContainer}>
            <div className={cl.DropMenuContainer}>
              <div className={cl.Logo}>
                <Logo />
              </div>
              {buttons.map((buttonItem) => {
                return (
                  <div key={buttonItem.id} className={cl.DropMenuPlaceholder}>
                    <DropMenu
                      buttonItem={buttonItem}
                      setInvisible={setInvisible}
                      variants={modalVariants}
                      mainContainerRef={scrollRef}
                      isActive={activeDropMenu === buttonItem.id}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

export default DropMenus;
