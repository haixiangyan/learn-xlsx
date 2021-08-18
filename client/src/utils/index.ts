import xlsx, {WorkBook} from 'xlsx';

/**
 * 转换 key
 * @param excelData
 * @param keysMap
 */
export function convertKeys<Raw = any, Target = any>(excelData: Raw[], keysMap: Record<string, string>): Target[] {
  return excelData.map(excelItem => {
    return Object.entries(excelItem).reduce((prev: any, curt) => {
      const [curtKey, curtValue] = curt;

      // 更新 key
      const mappedKey = keysMap[curtKey];
      if (mappedKey) {
        prev[mappedKey] = curtValue;
      } else {
        prev[curtKey] = curtValue;
      }

      return prev;
    }, {});
  })
}

/**
 * 从 excel 文件读取数据
 * @param excelRcFileBuffer excel 文件
 */
export function importExcelFromBuffer<Item = any>(excelRcFileBuffer: ArrayBuffer): Item[] {
  // 读取表格对象
  const workbook = xlsx.read(excelRcFileBuffer, {type: 'buffer'});
  // 找到第一张表
  const sheetNames = workbook.SheetNames;
  const sheet1 = workbook.Sheets[sheetNames[0]];
  // 读取内容
  return xlsx.utils.sheet_to_json(sheet1);
}

/**
 * 导出 excel 文件
 * @param array JSON 数组
 * @param sheetName 第一张表名
 * @param fileName 文件名
 */
export function exportExcel(array: any[], sheetName = '表1', fileName = 'example.xlsx') {
  const jsonWorkSheet = xlsx.utils.json_to_sheet(array);
  const workBook: WorkBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet,
    }
  };
  return xlsx.writeFile(workBook, fileName);
}
