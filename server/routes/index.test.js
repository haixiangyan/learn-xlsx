const request = require('supertest');
const path = require("path");
const fs = require('fs');

const app = require('../app');
const {importExcelFromBuffer} = require("../utils");

const testExcelFilePath = path.join(__dirname, '../../test.xlsx')
const testData = [{ 姓名: 'Jack', 年龄: 11 }, { 姓名: 'Mary', 年龄: 12 }]
const excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

describe('/excel_to_data', () => {
  it('将 Excel 转换成数据', (done) => {
    request(app)
      .post('/excel_to_data')
      .attach('excel', testExcelFilePath)
      .expect(200, { data: testData })
      .end(done);
  })
})

describe('/data_to_excel', () => {
  const tempExcelFileName = 'hello.xlsx';
  const tempExcelFilePath = path.join(__dirname, `./${tempExcelFileName}`);

  afterEach(() => {
    if (fs.existsSync(tempExcelFilePath)) {
      fs.unlinkSync(tempExcelFilePath);
    }
  })

  it('将数据转换成 Excel', (done) => {
    request(app)
      .post('/data_to_excel')
      .send({ data: testData })
      .expect(200)
      .expect('Content-Type', excelMimeType)
      .expect((res) => {
        fs.writeFileSync(tempExcelFilePath, new Buffer(res.body, 'binary'));

        const excelFileBuffer = fs.readFileSync(tempExcelFilePath);
        const convertedData = importExcelFromBuffer(excelFileBuffer);
        expect(convertedData).toEqual(data);
      })
      .end(done);
  })
})
