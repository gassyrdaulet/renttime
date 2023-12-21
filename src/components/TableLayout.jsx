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
  background-color: rgb(245, 232, 215);
`;
const Body = styled.tbody`
  background-color: rgb(255, 255, 255);
`;
const TableRow = styled.tr`
  background-color: ${(props) => (props.style?.rowMarked ? "#58cf99" : "")};
  &:hover {
    background-color: ${(props) =>
      props.style?.rowMarked ? "#58cf99" : "rgb(235, 235, 235)"};
  }
`;
const TableHeaderColumn = styled.th`
  text-align: center;
  text-transform: uppercase;
  border-top: none;
  border: 1px solid rgb(212, 212, 212);
  overflow: hidden;
  padding: 5px;
  vertical-align: top;
  min-width: ${(props) => props.style?.fixedMinWidth};
  width: ${(props) => props.style?.fixedJustWidth};
  max-width: ${(props) => props.style?.fixedMaxWidth};
  cursor: ${(props) =>
    props.style?.cursorType ? props.style.cursorType : "default"};
`;
const TableColumn = styled.td`
  border: 1px solid rgb(212, 212, 212);
  overflow: hidden;
  padding: 5px;
  text-align: ${(props) => props.style?.dataAlign};
  vertical-align: ${(props) =>
    props.style?.vertical ? props.style.vertical : "top"};
  cursor: ${(props) =>
    props.style?.cursorType ? props.style.cursorType : "default"};
  padding-bottom: 20px;
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
                      style={item.dataStyle}
                    >
                      {dataItem[item.id] ? dataItem[item.id] : "-"}
                    </TableColumn>
                  );
                } else if (item.type === "other") {
                  return (
                    <TableColumn
                      onClick={() => onClickRow(dataItem)}
                      key={item.id}
                      style={item.dataStyle}
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
