import { TableItem } from "./utils/types";

export const getMockData: () => Promise<Array<TableItem>> = async () => {
  const reponse = await fetch(
    "https://www.fastmock.site/mock/694c2558f19288859ad9b4a742791e1e/tel/data"
  );
  const { list } = await reponse.json();
  return list;
};
