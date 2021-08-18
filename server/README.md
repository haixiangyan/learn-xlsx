# 后端

使用 [Express.js](https://expressjs.com/) 实现 Excel 的导入导出功能。

## 运行

```shell
npm run start
```

接口在 [http://localhost:4200](http://localhost:4200) 开放。

## 单元测试

使用 [jest](https://jestjs.io/) 进行单元测试。主要测试：

* convertKeys
* importExcelFromBuffer
* exportExcelFromData

使用以下命令测试：

```shell
npm run test
```

## e2e测试

使用 [supertest]() 进行集成测试。主要测试：

* /data_to_excel 接口
* /excel_to_data 接口

使用以下命令测试：

```shell
npm run test
```
