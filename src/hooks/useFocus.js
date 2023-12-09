import { useState, useEffect, useRef } from "react";

const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);
  const targetRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const element = targetRef.current;

    if (element) {
      // Проверяем, находится ли фокус на элементе при монтировании
      setIsFocused(element === document.activeElement);

      // Добавляем обработчики событий для отслеживания фокуса и разфокуса
      element.addEventListener("focus", handleFocus);
      element.addEventListener("blur", handleBlur);

      // Очистка обработчиков событий при размонтировании компонента
      return () => {
        element.removeEventListener("focus", handleFocus);
        element.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  return [targetRef, isFocused];
};

export default useFocus;
