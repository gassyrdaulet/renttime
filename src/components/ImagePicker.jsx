import { useCallback, useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaImage, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const borderAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    border: 1px solid #ccc
  }
  40% {
    border: 1px solid #fff
  }
  60% {
    border: 1px solid #fff
  }
`;
const ImageInputWrapper = styled.div`
  padding: 0 10px;
  margin: 0 auto;
`;
const ImagePickerLabel = styled.p`
  user-select: none;
  text-align: center;
  width: 100%;
`;
const ImageInput = styled.label`
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 300px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  background-color: #3498db;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 10px;
  &:hover {
    background-color: #2980b9;
  }
  & input {
    display: none;
  }
`;
const ImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  animation: ${(props) =>
    props.loading === "true" &&
    css`
      ${borderAnimation} + 0.5s ease infinite
    `};
`;
const Image = styled.img`
  object-fit: fill;
  width: 100%;
  height: 100%;
  background-color: black;
  pointer-events: none;
`;
const ResolutionsWrapper = styled.div`
  position: absolute;
  top: 0;
  margin: 3px;
  padding: 2px;
  left: 0;
  font-size: 10px;
  color: #ddd;
`;
const DeleteButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  color: #3498db;
  margin: 3px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  z-index: 4;
`;

function ImagePicker({
  label,
  selectedImage,
  setSelectedImage,
  maxSize,
  disabled,
  width = 256,
  height = 256,
}) {
  const imageInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [blockLabel, setBlockLabel] = useState(false);
  const [imageResolution, setImageResolution] = useState({
    width: 0,
    height: 0,
  });

  const selectFile = useCallback(
    (file) => {
      if (file) {
        try {
          if (!file.type.startsWith("image/")) {
            setSelectedImage(null);
            return toast.error(`Неверный формат файла.`, { draggable: false });
          }
          if (file.size > maxSize * 1024) {
            setSelectedImage(null);
            return toast.error(
              `Файл слишком большой. Максимальный размер: ${maxSize} KB.`,
              { draggable: false }
            );
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");
            img.onload = () => {
              if (img.width >= width && img.height >= height) {
                setSelectedImage(reader.result);
              } else {
                setSelectedImage(null);
                return toast.error(
                  `Неподходящее разрешение изображения. Минимальное разрешение: ${width} x ${height} px.`,
                  {
                    draggable: false,
                  }
                );
              }
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        } catch (e) {
          return toast.error(`Ошибка при выборе изображения.`, {
            draggable: false,
          });
        }
      }
    },
    [height, maxSize, width, setSelectedImage]
  );

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      selectFile(file);
    },
    [selectFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        if (files.length > 1) {
          toast.error("Нельзя выбрать больше одного файла.");
          return;
        }
        selectFile(files[0]);
      }
    },
    [selectFile]
  );

  useEffect(() => {
    if (!selectedImage) {
      setImageResolution({ width: 0, height: 0 });
      return;
    }
    if (selectedImage) {
      const img = document.createElement("img");
      img.onload = () => {
        try {
          setImageResolution({ width: img.width, height: img.height });
        } catch {
          setImageResolution({ width: 0, height: 0 });
        }
      };
      img.src = selectedImage;
    }
  }, [selectedImage]);

  useEffect(() => {
    if (blockLabel) {
      setTimeout(() => setBlockLabel(false), 100);
    }
  }, [blockLabel]);

  return (
    <ImageInputWrapper>
      <ImagePickerLabel>{label}</ImagePickerLabel>
      <ImageInput
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ImageContainer loading={dragging + ""}>
          {selectedImage ? (
            <Image src={selectedImage} alt="Preview" />
          ) : (
            <FaImage />
          )}
          <ResolutionsWrapper>
            {imageResolution.width}x{imageResolution.height}
          </ResolutionsWrapper>
          {selectedImage && (
            <DeleteButton
              onClick={() => {
                setBlockLabel(true);
                setSelectedImage(null);
                imageInputRef.current.value = "";
              }}
            >
              <FaTrash />
            </DeleteButton>
          )}
        </ImageContainer>
        <input
          ref={imageInputRef}
          accept=".jpeg, .jpg, .png"
          disabled={disabled || blockLabel}
          type="file"
          onChange={handleImageChange}
        />
        {dragging ? "Отпустите мышь!" : "Выберите файл"}
      </ImageInput>
    </ImageInputWrapper>
  );
}

export default ImagePicker;
