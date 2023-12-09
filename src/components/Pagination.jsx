import styled from "styled-components";
import VolumeSlider from "../components/Volume";
import { useRef, useState, useEffect, useCallback } from "react";

const PaginationWrapper = styled.div`
  display: block;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const PageButton = styled.button`
  user-select: none;
  padding: 8px 12px;
  margin: ${(props) => (props.style?.margin ? props.style.margin : " 0 4px;")};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) =>
    props.style?.active ? "#007bff" : "transparent"};
  color: ${(props) => (props.style?.active ? "#fff" : "#007bff")};
  &:disabled {
    cursor: default;
    background-color: ${(props) => (props.style?.active ? "#007bff" : "#eee")};
    color: ${(props) => (props.style?.active ? "#fff" : "#ccc")};
  }
`;
const PagesWrapper = styled.div`
  overflow-x: auto;
  margin-right: 4px;
  &::-webkit-scrollbar {
    height: 0;
  }
`;
const Pages = styled.div`
  display: flex;
`;

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  const [scrollX, setScrollX] = useState(0);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const pagesWrapperRef = useRef(null);

  const handlePageChange = (page) => {
    if (currentPage === page) return;
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const onScroll = useCallback((e) => {
    setScrollX(() => {
      const totalScrollWidth =
        pagesWrapperRef.current.scrollWidth -
        pagesWrapperRef.current.clientWidth;
      const scrollXValue = (e.target.scrollLeft / totalScrollWidth) * 100;
      return Math.ceil(scrollXValue);
    });
  }, []);

  useEffect(() => {
    if (pagesWrapperRef.current) {
      if (
        pagesWrapperRef.current.scrollWidth ===
        pagesWrapperRef.current.clientWidth
      ) {
        setVolumeVisible(false);
        return setScrollX(100);
      }
      setVolumeVisible(true);
      const totalScrollWidth =
        pagesWrapperRef.current.scrollWidth -
        pagesWrapperRef.current.clientWidth;
      const scrollToValue = (scrollX / 100) * totalScrollWidth;
      pagesWrapperRef.current.scrollLeft = scrollToValue;
    }
  }, [scrollX]);

  useEffect(() => {
    if (pagesWrapperRef.current) {
      if (
        pagesWrapperRef.current.scrollWidth ===
        pagesWrapperRef.current.clientWidth
      ) {
        setVolumeVisible(false);
        return setScrollX(100);
      }
      setVolumeVisible(true);
      const totalScrollWidth =
        pagesWrapperRef.current.scrollWidth -
        pagesWrapperRef.current.clientWidth;
      const scrollToValue = (currentPage / totalPages) * totalScrollWidth;
      pagesWrapperRef.current.scrollLeft =
        scrollToValue +
        (currentPage / totalPages > 0.5
          ? 0
          : -pagesWrapperRef.current.clientWidth / 2);
    }
  }, [currentPage, totalPages]);

  return (
    <PaginationWrapper>
      {volumeVisible && (
        <VolumeSlider
          volume={scrollX}
          onChange={(e) => {
            setScrollX(e.target.value);
          }}
        />
      )}
      <PaginationContainer>
        <PageButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          style={{ margin: "0 4px 0 0" }}
        >
          Пред.
        </PageButton>
        <PagesWrapper ref={pagesWrapperRef} onScroll={onScroll}>
          <Pages>
            {[...Array(totalPages).keys()].map((page) => (
              <PageButton
                key={page + 1}
                disabled={loading}
                onClick={() => handlePageChange(page + 1)}
                style={{ active: currentPage === page + 1 }}
              >
                {page + 1}
              </PageButton>
            ))}
          </Pages>
        </PagesWrapper>
        <PageButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          style={{ margin: "0 4px 0 0" }}
        >
          След.
        </PageButton>
      </PaginationContainer>
    </PaginationWrapper>
  );
};

export default Pagination;
