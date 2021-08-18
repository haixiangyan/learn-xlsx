import path from 'path';
import fs from 'fs';
import {convertKeys, importExcelFromBuffer} from "./index";

const excelFilePath = path.join(__dirname, '../../../test.xlsx');

describe('convertKeys', () => {
  const rawData = [{ name: 'Jack', age: 11 }, { name: 'mama', age: 22 }]

  it('可以转换部分 key', () => {
    const keysMap = { name: '姓名' }
    const result = convertKeys(rawData, keysMap);
    const expected = [{ 姓名: 'Jack', age: 11 }, { 姓名: 'mama', age: 22 }]
    expect(result).toEqual(expected);
  })
  it('正常转换所有 key', () => {
    const keysMap = { name: '姓名', age: '年龄' }
    const result = convertKeys(rawData, keysMap);
    const expected = [{ 姓名: 'Jack', 年龄: 11 }, { 姓名: 'mama', 年龄: 22 }]
    expect(result).toEqual(expected);
  })
  it('可以保留原有数据', () => {
    const result = convertKeys(rawData, {});
    expect(result).toEqual(rawData);
  })
})

describe('importExcel', () => {
  const excelFileBuffer = fs.readFileSync(excelFilePath);
  const data = [{ 姓名: 'Jack', 年龄: 11 }, { 姓名: 'Mary', 年龄: 12 }]

  it('正常解析 Excel 文件', () => {
    const jsonArray = importExcelFromBuffer(excelFileBuffer);
    expect(jsonArray).toEqual(data);
  })
});

export default {}
