import cl from "../styles/ContainerLayout.module.css";
import SearchInput from "./SearchInput";
import MyButton from "./MyButton";

function ContainerLayout({
  leftContent,
  mainContent,
  searchInputText,
  setSearchInputText,
  onClickSearchButton,
  searchButtonText = "Найти",
  searchButtonLoading,
  searchInputMaxLetters,
}) {
  return (
    <div className={cl.Wrapper}>
      {setSearchInputText && (
        <form className={cl.SearchWrapper + " " + cl.SearchWrapperDesktop}>
          <SearchInput
            maxLetters={searchInputMaxLetters}
            borderTRRadius={onClickSearchButton && "0"}
            borderBRRadius={onClickSearchButton && "0"}
            value={searchInputText}
            height="100%"
            setValue={setSearchInputText}
          />
          {onClickSearchButton && (
            <MyButton
              type="submit"
              text={searchButtonText}
              onClick={(e) => {
                e.preventDefault();
                onClickSearchButton();
              }}
              height="100%"
              disabled={searchButtonLoading}
              margin="0 0 0 0"
              borderTLRadius={onClickSearchButton && "0"}
              borderBLRadius={onClickSearchButton && "0"}
            />
          )}
        </form>
      )}

      <div className={cl.ContainerLayout}>
        <div className={cl.LeftContainerWrapper}>
          <div className={"Window " + cl.LeftContainer}>{leftContent}</div>
        </div>
        {setSearchInputText && (
          <form className={cl.SearchWrapper + " " + cl.SearchWrapperMobile}>
            <SearchInput
              maxLetters={searchInputMaxLetters}
              borderTRRadius={onClickSearchButton && "0"}
              borderBRRadius={onClickSearchButton && "0"}
              value={searchInputText}
              height="100%"
              setValue={setSearchInputText}
            />
            {onClickSearchButton && (
              <MyButton
                type="submit"
                text={searchButtonText}
                onClick={(e) => {
                  e.preventDefault();
                  onClickSearchButton();
                }}
                height="100%"
                disabled={searchButtonLoading}
                margin="0 0 0 0"
                borderTLRadius={onClickSearchButton && "0"}
                borderBLRadius={onClickSearchButton && "0"}
              />
            )}
          </form>
        )}
        <div className={cl.MainContainerWrapper}>
          <div className={"Window " + cl.MainContainer}>{mainContent}</div>
        </div>
      </div>
    </div>
  );
}

export default ContainerLayout;
