import { useState, useCallback, useMemo, useEffect } from "react";
import MyInput from "./MyInput";
import ImagePicker from "./ImagePicker";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import FormLayout from "./FormLayout";
import { deleteImage, editGood, getAllGroups } from "../api/GoodsApi";
import { finalIpAddress } from "../api/Axios";
import BlueLinkButton from "../components/BlueLinkButton";
import ConfirmModal from "./ConfirmModal";

function EditGoodForm({ isLoading, setLoading, data, next }) {
  const { token, organizationId } = useAuth();
  const [inputs, setInputs] = useState([
    {
      id: 0,
      title: "Название",
      value: data.name ? data.name : "",
      name: "name",
      inputMode: "text",
    },
    {
      id: 1,
      title: "Стоимость за минуту",
      value: data.price_per_minute ? data.price_per_minute : "0",
      name: "price_per_minute",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 2,
      title: "Стоимость за час",
      value: data.price_per_hour ? data.price_per_hour : "0",
      name: "price_per_hour",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 3,
      title: "Стоимость за сутки",
      value: data.price_per_day ? data.price_per_day : "0",
      name: "price_per_day",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 4,
      title: "Стоимость за месяц",
      value: data.price_per_month ? data.price_per_month : "0",
      name: "price_per_month",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
    {
      id: 5,
      title: "Стоимость возмещения",
      value: data.compensation_price ? data.compensation_price : "0",
      name: "compensation_price",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
  ]);
  const [selectedImage, setSelectedImage] = useState(
    data.photo
      ? finalIpAddress +
          "/images/" +
          organizationId +
          `/original_` +
          data.photo +
          data.id +
          ".jpeg"
      : null
  );
  const [selectedGroup, setSelectedGroup] = useState(
    data.group_id ? parseInt(data.group_id) : -1
  );
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [confirmDeleteImageModal, setConfirmDeleteImageModal] = useState(false);
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);

  useEffect(() => {
    getAllGroups(setGroupsLoading, token, setGroups);
  }, [token]);

  const defaultOptions = useMemo(
    () => [{ id: -1, name: "Оставить без группы" }],
    []
  );

  const handleInputChange = useCallback((id, value) => {
    setInputs((prev) => {
      const temp = [...prev];
      for (let item of temp) {
        if (item.id === id) {
          item.value = value;
          break;
        }
      }
      return temp;
    });
  }, []);

  const buttons = useMemo(
    () => [
      {
        id: 1,
        text: "Сохранить",
        type: "submit",
        loading: String(isLoading),
        disabled: isLoading,
        onClick: (e) => {
          e.preventDefault();
          const goodData = {};
          inputs.forEach((item) => {
            goodData[item.name] = item.value;
          });
          editGood(
            setLoading,
            token,
            {
              ...goodData,
              group_id: selectedGroup,
              good_id: data.id,
            },
            selectedImage,
            next
          );
        },
      },
    ],
    [
      setLoading,
      next,
      isLoading,
      token,
      selectedGroup,
      selectedImage,
      inputs,
      data.id,
    ]
  );

  return (
    <FormLayout
      firstHalf={
        <div>
          {inputs.map((item) => (
            <MyInput
              onChange={(e) => {
                handleInputChange(item.id, e.target.value);
              }}
              label={item.title}
              key={item.id}
              value={item.value}
              disabled={isLoading}
              inputMode={item.inputMode}
              integer={item.integer}
              unsigned={item.unsigned}
              zerofill={item.zerofill}
            />
          ))}
          <Select
            label="Группа"
            value={selectedGroup}
            setValue={(v) => setSelectedGroup(parseInt(v))}
            loading={groupsLoading}
            disabled={isLoading || groupsLoading}
            defaultOptions={defaultOptions}
            options={groups}
          />
        </div>
      }
      secondHalf={
        <div>
          <ImagePicker
            disabled={isLoading}
            label="Выберите изображение"
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            maxSize={1000}
          />
          <BlueLinkButton
            text="Удалить изображение"
            onClick={() => setConfirmDeleteImageModal(true)}
            disabled={deleteImageLoading}
          />
          <ConfirmModal
            visible={confirmDeleteImageModal}
            setVisible={setConfirmDeleteImageModal}
            loading={deleteImageLoading}
            title="Подтвердите действие"
            question="Вы уверены что хотите удалить изображение у этого товара?"
            onConfirm={() => {
              deleteImage(setDeleteImageLoading, token, data.id, () => {
                setConfirmDeleteImageModal(false);
                setSelectedImage(null);
                next();
              });
            }}
          />
        </div>
      }
      buttons={buttons}
    />
  );
}

export default EditGoodForm;
