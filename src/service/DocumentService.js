import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const getFormattedContent = (
  orderData,
  orgData,
  template,
  setContent
) => {
  try {
    const sources = { orderData, orgData };
    const getFormattedText = (textArray) => {
      if (!textArray) {
        return "";
      }
      if (typeof textArray === "string") {
        return textArray;
      }
      const result = textArray.map((item) => {
        if (item.type === "text") {
          return item.value;
        } else if (item.type === "variable") {
          return sources?.[item.source]?.[item.value];
        } else {
          return "";
        }
      });
      return result.join("");
    };

    const getFormattedTable = (schema, variable, source, index) => {
      if (!variable || !source) {
        return [];
      }
      if (!sources?.[source]?.[variable]) {
        return [];
      }
      const formattedTable = sources[source][variable].map((item, i) => {
        const formattedRow = schema.map((schemaItem) => {
          return {
            value: item?.[schemaItem.key],
            style: {
              alignCenter: schemaItem?.center,
            },
          };
        });
        if (index) {
          return [
            {
              value: i + 1,
              style: {
                alignCenter: true,
              },
            },
            ...formattedRow,
          ];
        } else {
          return formattedRow;
        }
      });
      const indexHeader = [];
      if (index) {
        indexHeader.push({ value: "№", style: { cellWidth: 20 } });
      }
      const headers = schema.map((schemaItem) => ({
        value: getFormattedText(schemaItem.title),
        style: { cellWidth: schemaItem.width },
      }));
      return [[...indexHeader, ...headers], ...formattedTable];
    };

    const dataRows = template.contentTemplate.map((dataRow) => {
      const rowItems = dataRow.rowItems.map((item) => {
        if (item.type === "table") {
          return {
            type: "table",
            style: {
              tableLeft: item.x,
              tableTop: item.y,
              textSize: item.size,
              textWeight: item.weight,
              tableWidth: item.width,
              textColor: item.color,
              tableBorder: item?.border,
            },
            table: getFormattedTable(
              item.schema,
              item.variable,
              item.source,
              item.index
            ),
          };
        } else if (item.type === "text") {
          return {
            type: item.type,
            style: {
              textCenterAlign: item.center,
              textFillAlign: item.fill,
              textLeft: item.x,
              textTop: item.y,
              textSize: item.size ? item.size : template.fontSize,
              textWeight: item.weight,
              textWidth: item.width,
              textColor: item.color,
            },
            text: getFormattedText(item.text),
          };
        } else if (item.type.startsWith("qr")) {
          return {
            type: item.type,
            style: { itemLeft: item.x, itemWidth: item.width },
          };
        } else {
          return {};
        }
      });
      return { rowItems, style: dataRow.style };
    });
    const dataRowsWithInvisibleChildren = dataRows.map((dataRow) => {
      const rowItemsWithInvisibleChildren = dataRow.rowItems.map((rowItem) => {
        return {
          ...rowItem,
          hidden: true,
        };
      });
      dataRow.rowItems = [
        ...rowItemsWithInvisibleChildren,
        ...dataRow.rowItems,
      ];
      return dataRow;
    });
    setContent(dataRowsWithInvisibleChildren);
  } catch (e) {
    console.log(e);
    setContent([]);
  }
};

export const generatePDF = async (
  elementRef,
  pdfWidth,
  pdfHeight,
  resolution = 350
) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [pdfWidth, pdfHeight],
  });
  const element = elementRef.current;
  const canvas = await html2canvas(element, { scale: resolution / 96 });
  const imgData = canvas.toDataURL("image/jpg");
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, "JPG", 0, 0, pdfWidth, imgHeight);
  if (imgHeight > pdfHeight) {
    let remainingHeight = imgHeight - pdfHeight;
    while (remainingHeight > 0) {
      pdf.addPage();
      pdf.addImage(
        imgData,
        "JPG",
        0,
        remainingHeight - imgHeight,
        pdfWidth,
        imgHeight
      );
      remainingHeight -= pdfHeight;
    }
  }
  return pdf;
};
