import { utils, writeFile } from "xlsx";

export const downloadExcel = (data, sheetName, fileName) => {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  writeFile(wb, `${fileName}.xlsx`);
};
