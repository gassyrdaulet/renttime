import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";
import styled from "styled-components";
import { useCallback, useMemo } from "react";

const TableWrapper = styled.div`
  display: block;
  width: 100%;
  overflow: auto;
  & ::-webkit-scrollbar {
    position: absolute;
    width: 0px;
    height: 5px;
    background-color: transparent;
  }
`;
const Table = styled.table`
  width: 100%;
  border-top: none;
  border-collapse: collapse;
  font-size: ${(props) => props.style?.tableFontSize}px;
`;
const Headers = styled.thead`
  user-select: none;
`;
const Body = styled.tbody``;
const TableRow = styled.tr`
  background-color: ${(props) => (props.style?.rowMarked ? "#58cf99" : "")};
  &:hover {
    background-color: ${(props) =>
      props.style?.rowMarked ? "#58cf99" : "rgb(235, 235, 235)"};
  }
`;
const TableHeaderColumn = styled.th`
  background-color: rgb(245, 232, 215);
  text-align: center;
  text-transform: uppercase;
  border-top: none;
  border: 1px solid rgb(212, 212, 212);
  overflow: hidden;
  padding: 5px;
  vertical-align: top;
  position: ${(props) =>
    props.style?.columnPosition ? props.style?.columnPosition : "static"};
  left: ${(props) => (props.style?.left ? props.style?.left : "0")}px;
  z-index: 1;
  min-width: ${(props) => props.style?.fixedMinWidth};
  width: ${(props) => props.style?.fixedJustWidth};
  max-width: ${(props) => props.style?.fixedMaxWidth};
  cursor: ${(props) =>
    props.style?.cursorType ? props.style.cursorType : "default"};
  &::before {
    position: absolute;
    display: block;
    content: "";
    width: 1px;
    height: 100%;
    background-color: rgb(212, 212, 212);
    right: 0;
    top: 0;
  }
  &::after {
    position: absolute;
    display: block;
    content: "";
    width: 2px;
    height: 100%;
    background-color: rgb(212, 212, 212);
    left: 0;
    top: 0;
  }
`;
const TableColumn = styled.td`
  border: 1px solid rgb(212, 212, 212);
  background-color: rgb(255, 255, 255);
  overflow: hidden;
  padding: 5px;
  text-align: ${(props) => props.style?.dataAlign};
  vertical-align: ${(props) =>
    props.style?.vertical ? props.style.vertical : "top"};
  cursor: ${(props) =>
    props.style?.cursorType ? props.style.cursorType : "default"};
  padding-bottom: 20px;
  position: ${(props) =>
    props.style?.columnPosition ? props.style?.columnPosition : "static"};
  left: ${(props) => (props.style?.left ? props.style?.left : "0")}px;
  z-index: 1;
  &::before {
    position: absolute;
    display: block;
    content: "";
    width: 1px;
    height: 100%;
    background-color: rgb(212, 212, 212);
    right: 0;
    top: 0;
  }
  &::after {
    position: absolute;
    display: block;
    content: "";
    width: 2px;
    height: 100%;
    background-color: rgb(212, 212, 212);
    left: 0;
    top: 0;
  }
`;

function TableLayout({
  headers,
  fontSize = 13,
  data,
  marked,
  setMarked,
  marking,
  onClickRow = () => {},
}) {
  const allMarked = useMemo(() => {
    if (!marked) {
      return false;
    }
    if (Object.keys(marked).length === data.length) {
      return true;
    }
    return false;
  }, [marked, data]);

  const handleMark = useCallback(
    (id) => {
      setMarked((prev) => {
        const temp = { ...prev };
        if (temp[id]) {
          delete temp[id];
          return temp;
        }
        temp[id] = true;
        return temp;
      });
    },
    [setMarked]
  );

  const markAll = useCallback(() => {
    if (allMarked) {
      return setMarked({});
    }
    setMarked(() => {
      const temp = {};
      data.forEach((item) => (temp[item.id] = true));
      return temp;
    });
  }, [setMarked, data, allMarked]);

  return (
    <TableWrapper>
      <Table style={{ tableFontSize: fontSize }}>
        <Headers>
          <tr>
            {marking && (
              <TableHeaderColumn
                style={{
                  fixedJustWidth: "50px",
                  fixedMaxWidth: "50px",
                  fixedMinWidth: "50px",
                  cursorType: "pointer",
                }}
                onClick={markAll}
              >
                {allMarked ? (
                  <BiCheckboxChecked size={25} />
                ) : (
                  <BiCheckbox size={25} />
                )}
              </TableHeaderColumn>
            )}
            {headers.map((item) => (
              <TableHeaderColumn style={item.style} key={item.id}>
                {item.title}
              </TableHeaderColumn>
            ))}
          </tr>
        </Headers>
        <Body>
          {data.length === 0 && (
            <TableRow>
              <TableColumn
                colSpan={1000 - 7}
                style={{
                  dataAlign: "center",
                  vertical: "center",
                }}
              >
                Ничего не найдено
              </TableColumn>
            </TableRow>
          )}
          {data.map((dataItem) => (
            <TableRow
              key={dataItem.id}
              style={{ rowMarked: marked?.[dataItem.id] }}
            >
              {marking && (
                <TableColumn
                  style={{
                    dataAlign: "center",
                    vertical: "center",
                    cursorType: "pointer",
                  }}
                  onClick={() => handleMark(dataItem.id)}
                >
                  {marked?.[dataItem.id] ? (
                    <BiCheckboxChecked size={25} />
                  ) : (
                    <BiCheckbox size={25} />
                  )}
                </TableColumn>
              )}
              {headers.map((item) => {
                if (item.type === "text") {
                  return (
                    <TableColumn
                      onClick={() => onClickRow(dataItem)}
                      key={item.id}
                      style={{
                        ...item.dataStyle,
                        columnPosition: item.style?.columnPosition,
                        left: item.style?.left,
                      }}
                    >
                      {dataItem[item.id] ? dataItem[item.id] : "-"}
                    </TableColumn>
                  );
                } else if (item.type === "other") {
                  return (
                    <TableColumn
                      onClick={() => onClickRow(dataItem)}
                      key={item.id}
                      style={{
                        ...item.dataStyle,
                        columnPosition: item.style?.columnPosition,
                        left: item.style?.left,
                      }}
                    >
                      {item.children({ dataItem })}
                    </TableColumn>
                  );
                }
                return "";
              })}
            </TableRow>
          ))}
        </Body>
      </Table>
    </TableWrapper>
  );
}

export default TableLayout;
