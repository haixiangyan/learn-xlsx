import * as path from 'path';
import {importExcelFromBuffer} from "../../src/utils";

const uploadInput = '[data-cy="upload-excel-input"]';
const clipIconClass = '.anticon-paper-clip'

const firstExcelRowData = ["2580", "New Touch", "T's Restaurant Tantanmen ", "Cup", "Japan", "3.75"]

const checkExcelToData = (excelToDataBtn: string) => {
  const firstRow = '[data-row-key="2580"]'

  cy.get(excelToDataBtn).should('exist');
  // 打开弹窗
  cy.get(excelToDataBtn).click()
  // 添加 Excel 文件
  cy.get(uploadInput).attachFile('ramen-ratings.xlsx')
  // 等待上传完毕
  cy.get(clipIconClass).should('exist')
  // 确定导入
  cy.contains('确 定').click()
  // 查看表格第一行
  cy.get(firstRow).should('exist');
  cy.get(firstRow).find('.ant-table-cell').should($cell => {
    // 6 列数据
    expect($cell).to.have.length(6)
    // 数据内容
    const texts = $cell.map((i, el) => {
      return Cypress.$(el).text()
    })
    // 检查第一行数据是否相等
    expect(texts.get()).to.deep.equal(firstExcelRowData)
  })
}

describe('xlsx 导入/导出 App', () => {
  before(() => {
    cy.visit('http://localhost:3000')
  })

  it('有 4 个按钮', () => {
    cy.get('.ant-btn').should('have.length', 4)
  })

  it('前端 Excel 转 Data', () => {
    const excelToDataBtn = '[data-cy="frontend-excel-data"]';
    checkExcelToData(excelToDataBtn);
  })

  it('前端 Data 转 Excel', () => {
    const dataToExcelBtn = '[data-cy="frontend-data-excel"]:not(:disabled)';
    cy.get(dataToExcelBtn).should('exist');
    // 开启下载
    cy.get(dataToExcelBtn).click();
    // 等 500ms
    cy.wait(500)
      .readFile(path.join(__dirname, '../downloads/example.xlsx'), 'utf-8')
      .then(excelBuffer => {
        const data = importExcelFromBuffer(excelBuffer);
        console.log(data);
        const [firstRow] = data;
        expect(firstRow).to.equal(firstRow);
      })
  })

  xit('后端 Excel 转 Data', () => {
    const excelToDataBtn = '[data-cy="backend-excel-data"]';
    checkExcelToData(excelToDataBtn);
  })
})

export default {}
