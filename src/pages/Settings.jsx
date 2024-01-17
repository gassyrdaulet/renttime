import { useState, useMemo, useEffect } from "react";
import ContainerLayout from "../components/ContainerLayout";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Groups from "../components/Groups";
import EditUsersForm from "../components/EditUsersForm";
import EditPaymentMethodsForm from "../components/EditPaymentMethodsForm";
import EditOrganizationProfile from "../components/EditOrganizationProfile";

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
`;

function Settings() {
  const params = useParams();
  const [selectedGroup, setSelectedGroup] = useState(params.group);
  const [switchLoading, setSwitchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/settings/${selectedGroup}`);
  }, [selectedGroup, navigate]);
  useEffect(() => {
    setSelectedGroup(params.group);
  }, [params.group]);

  const settingsForms = useMemo(
    () => ({
      users: (
        <EditUsersForm
          isLoading={switchLoading}
          setIsLoading={setSwitchLoading}
        />
      ),
      methods: (
        <EditPaymentMethodsForm
          isLoading={switchLoading}
          setIsLoading={setSwitchLoading}
        />
      ),
      organization: (
        <EditOrganizationProfile
          isLoading={switchLoading}
          setIsLoading={setSwitchLoading}
        />
      ),
    }),
    [switchLoading]
  );

  const leftContent = (
    <div>
      <Groups
        defaultOptions={[
          {
            id: "organization",
            name: `Профиль организации`,
          },
          {
            id: "users",
            name: `Настройки пользователей`,
          },
          {
            id: "methods",
            name: `Методы оплаты`,
          },
        ]}
        switchLoading={switchLoading}
        setSelectedGroup={setSelectedGroup}
        selectedGroup={selectedGroup}
        groupsLoading={false}
        onGroupChange={() => {}}
        groups={[]}
      />
    </div>
  );

  const mainContent = <MainContent>{settingsForms[selectedGroup]}</MainContent>;

  return (
    <ContainerLayout leftContent={leftContent} mainContent={mainContent} />
  );
}

export default Settings;
