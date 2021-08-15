import xlsx from 'xlsx';
import {RcFile} from "antd/es/upload";

/**
 * 从 excel 文件读取数据
 * @param excelRcFile excel 文件
 */
export async function importExcel<Item = any>(excelRcFile: RcFile): Promise<Item[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      if (!event.target) {
        return reject(new Error('读取失败'));
      }

      try {
        const {result} = event.target;
        // 读取表格对象
        const workbook = xlsx.read(result, {type: 'binary'});
        // 找到第一张表
        const sheetNames = workbook.SheetNames;
        const sheet1 = workbook.Sheets[sheetNames[0]];
        // 读取内容
        const data: Item[] = xlsx.utils.sheet_to_json(sheet1);
        resolve(data);
      } catch (error) {
        reject(error)
      }
    }

    reader.readAsBinaryString(excelRcFile);
  });
}
