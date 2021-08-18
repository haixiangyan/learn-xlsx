const path = require("path");
const fs = require('fs');
const {importExcelFromBuffer, exportExcelFromData, convertKeys} = require("./index");

const testExcelFilePath = path.join(__dirname, '../../test.xlsx');

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

describe('importExcelFromBuffer', () => {
  it('可以正常导入 Excel 数据', () => {
    const excelFileBuffer = fs.readFileSync(testExcelFilePath);
    const expected = [{ 姓名: 'Jack', 年龄: 11 }, { 姓名: 'Mary', 年龄: 12 }]
    const result = importExcelFromBuffer(excelFileBuffer);
    expect(result).toEqual(expected);
  })
})

describe('exportExcelFromData', () => {
  const data = [{ 姓名: 'Jack', 年龄: 11 }, { 姓名: 'Mary', 年龄: 12 }]
  const tempExcelFileName = 'hello.xlsx';
  const tempExcelFilePath = path.join(__dirname, `./${tempExcelFileName}`);

  afterEach(() => {
    if (fs.existsSync(tempExcelFilePath)) {
      fs.unlinkSync(tempExcelFilePath);
    }
  })

  it('正常导出 Excel 文件', () => {
    const excelBuffer = exportExcelFromData(data, undefined, tempExcelFileName);
    fs.writeFileSync(tempExcelFilePath, new Buffer(excelBuffer, 'binary'));

    const excelFileBuffer = fs.readFileSync(tempExcelFilePath);
    const convertedData = importExcelFromBuffer(excelFileBuffer);
    expect(convertedData).toEqual(data);
  })
})
