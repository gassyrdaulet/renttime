import cl from "../styles/Groups.module.css";
import Loading from "./Loading";
import GroupRow from "./GroupRow";
import Select from "./Select";
import { useNavigate } from "react-router-dom";

function Groups({
  setSelectedGroup,
  groupsLoading,
  groups,
  selectedGroup,
  switchLoading,
  defaultOptions,
  onGroupChange = () => {},
  next = () => {},
}) {
  const navigate = useNavigate();

  return (
    <div className={cl.GroupsWrapper}>
      <div className={cl.GroupsDesktop}>
        {defaultOptions.map((item) => (
          <p
            key={item.id}
            className={
              cl.GroupName + " " + (selectedGroup === item.id && cl.ActiveGroup)
            }
            style={{ fontWeight: "bold" }}
            onClick={() => {
              onGroupChange();
              if (!switchLoading) setSelectedGroup(item.id);
            }}
          >
            {item.name}
          </p>
        ))}
        {groupsLoading ? (
          <div className="LoadingWrapper1">
            <Loading which="gray" />
          </div>
        ) : (
          groups.map((item) => {
            return (
              <GroupRow
                className={selectedGroup === item.id && cl.ActiveGroup}
                key={item.id}
                navigate={navigate}
                setGroup={(v) => {
                  if (!switchLoading) {
                    onGroupChange();
                    setSelectedGroup(v);
                  }
                }}
                id={item.id}
                name={item.name}
                next={next}
              />
            );
          })
        )}
      </div>
      <div className={cl.GroupsMobile}>
        <Select
          value={selectedGroup}
          defaultOptions={defaultOptions}
          loading={groupsLoading}
          setValue={(v) => {
            onGroupChange();
            setSelectedGroup(v);
          }}
          options={groups}
        />
      </div>
    </div>
  );
}

export default Groups;
