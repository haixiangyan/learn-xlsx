# 前端

使用 [React.js](https://reactjs.org/) + [Ant Design](https://ant.design/index-cn) 实现前端的 Excel 导入导出 App。

## 运行

```shell
npm run start
```

打开 [http://localhost:3000](http://localhost:3000) 访问即可。

## 单元测试

使用 [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) 自带的 [jest](https://jestjs.io/) 进行单元测试。
主要测试：

* convertKeys
* importExcelFromBuffer
* exportExcelFile

```shell
npm run test
```

## e2e测试

使用 [cypress](https://www.cypress.io/) 进行集成测试。主要测试：
* 前端 Excel 转 Data
* 前端 Data 转 Excel
* 后端 Excel 转 Data
* 后端 Data 转 Excel

使用以下命令测试：

```shell
npm run cypress:open
```
