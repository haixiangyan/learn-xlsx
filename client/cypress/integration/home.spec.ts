const uploadInput = '[data-cy="upload-excel-input"]';

describe('xlsx 导入/导出 App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('有 4 个按钮', () => {
    cy.get('.ant-btn').should('have.length', 4)
  })

  it('前端 Excel 转 Data', () => {
    const excelToDataBtn = '[data-cy="frontend-excel-data"]';
    const firstRow = '[data-row-key="2580"]'

    cy.get(excelToDataBtn).should('exist');
    cy.get(excelToDataBtn).click()
    cy.get(uploadInput).attachFile('ramen-ratings.xlsx')
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
      expect(texts.get()).to.deep.equal(["2580", "New Touch", "T's Restaurant Tantanmen ", "Cup", "Japan", "3.75"])
    })
  })
})

export default {}
