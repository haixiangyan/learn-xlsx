# learn-xlsx

[![cypress](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/ixtpfx&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/ixtpfx/runs)
[![travis](https://www.travis-ci.com/Haixiang6123/learn-xlsx.svg?branch=main)](https://www.travis-ci.com/Haixiang6123/learn-xlsx)
[![coveralls](https://coveralls.io/repos/github/haixiangyan/learn-xlsx/badge.svg?branch=main)](https://coveralls.io/github/haixiangyan/learn-xlsx?branch=main)

使用 [xlsx](https://www.npmjs.com/package/xlsx) 实现 Excel 导入导出。

## 技术栈

* [xlsx](https://www.npmjs.com/package/xlsx)
* [react.js](https://reactjs.org/)
* [ant design](https://ant.design/index-cn)
* [express.js](https://expressjs.com/)
* [cypress](https://www.cypress.io/)
* [jest](https://www.cypress.io/)
* [supertest](https://www.npmjs.com/package/supertest)

## 项目说明书

* [前端说明书](./client)
* [后端说明书](./server)


## 前言

如果你和我一样经常和管理页面打交道，那么 **Excel导入数据** 和 **数据导出Excel** 这两个需求一定是逃不掉的。

相信大多数人也知道 [xlsx](https://www.npmjs.com/package/xlsx) 这个 npm 库，但是文档内容实在是太多，太冗余了。很多人的需求就是一个简单的导入导出，但文档愣是把整个 xlsx 系统给解释了一遍，看了半天也没找到 Demo， 找到 Demo 也跑不太起来。

网上的博客要不扔个 `xlsx.utils.sheet_to_json` 就完了，要不写很多很长的代码（很多循环那种），唉。就让这篇文章终结这个需求吧！

本篇文章主要内容为

* 前端处理导入导出
* 后端处理导入导出
* 一些简单的组件封装

代码都放在 [Github 的 learn-xlsx](https://github.com/haixiangyan/learn-xlsx) 上，除此之外，我还用 [Jest](https://jestjs.io/) 写了 **单元测试**，用 [Cypress](https://www.cypress.io/) 和 [supertest](https://www.npmjs.com/package/supertest) 做 **e2e 测试**，感兴趣的可以 clone 下来按需白嫖哦~


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16d1ba03988e4cf4b6b5bfa317a51153~tplv-k3u1fbpfcp-watermark.image)

## 需求

我们再来梳理一下需求：
* 提供一个 Excel 文件，将里面的内容导出成 JSON 数组
* 提供一个 JSON 数组，生成 Excel 文件并下载

## 基础知识

首先，在用 [xlsx](https://www.npmjs.com/package/xlsx) 这个 npm 库前，还是要清楚一些基本的 Office Excel 知识。

看图意会：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70c23b21d6cc44f79ef8292fb5c30a58~tplv-k3u1fbpfcp-watermark.image)

当我们新建一个 Excel 文档时，这个文档就是 Workbook，而一个 Workbook 下会有多个 sheet。

## 前端导入 Excel 数据

来看第一个需求：给定一个 Excel 文件，导入里面的数据。

一般来说，需要导入的 Excel 文件都不会一个 Workbook 里有好几十个 Sheet 的，比较常见就一个 Sheet。毕竟管理后台一般就只会导入一个表的数据。所以，下面我都以一个 Sheet 的情况来实现，多个 Sheet 的情况你们自己实现加个循环就好了。

先来实现一个从 File 的 Array Buffer 中读取 Excel 的工具函数：

```ts
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
```

非常直白，就不多废话了。不过，这里估计有人会有疑问：为什么我的入参选择了 `ArrayBuffer` 呢而不是 `File` 呢？

其实用 `RcFile` 或者 `File` 作为入参也是可以的，只不过我发现在用 Jest 写单元测试时，`fs.readFileSync` 的返回值只能是 `ArrayBuffer`，所以这里做了妥协。

下一步：拿到 Excel 文件，并获取其 `ArrayByffer`。这里我用 Ant Design 的 Upload 组件来获取文件：

```tsx
const excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const LocalImportModal: FC<Props> = (props) => {
  const {onImport, onSubmit, onCancel, onOk, ...modalProps} = props;

  const [excelData, setExcelData] = useState<any[]>([]);

  // 获取文件并解析
  const localExcelToData = async (options: RcCustomRequestOptions) => {
    const {file, onSuccess, onError} = options;

    try {
      // xlsx 导入 excel
      const excelData = importExcelFromBuffer<ExcelRamenReview>(await (file as RcFile).arrayBuffer());
      // 设置 data
      setExcelData(excelData);

      if (onImport) onImport(data);

      if (onSuccess) onSuccess(data, new XMLHttpRequest());
    } catch (e) {
      if (onError) onError(e)
    }
  }

  const innerOnOk = (e: React.MouseEvent<HTMLElement>) => {
    if (onSubmit) onSubmit(excelData);
    if (onOk) onOk(e);
    if (onCancel) onCancel(e);
  }

  return (
    <Modal onCancel={onCancel} onOk={innerOnOk} {...modalProps}>
      <Dragger accept={excelMimeType} customRequest={localExcelToData}>
        <Button type="primary">前端Excel转Data</Button>
      </Dragger>
    </Modal>
  )
}
```

没有用通用的 `<input type="file">` 而直接使用 Ant Design 的 `<Upload>` 组件，是因为我觉得大家一般是要用 Ant Design 来做开发的，直接给业务实践比说理论更实用。

上面还有以下细节：
* 使用 `customRequest` 来获取 File，然后将其 `buffer` 传入 `importExcelFromBuffer` 函数解析
* 在 `customRequest` 里调用了 `onSuccess` 这个回调，如果不调用它，Upload 组件的就会一直显示 loading 状态，非常烦人
* `accept` 里填入 Excel 文件的 [MIME Type](https://www.google.com.hk/search?q=excel+mime+type&oq=excel+mime+type&aqs=chrome.0.69i59j0i512l4j0i22i30j69i60l2.3920j0j7&sourceid=chrome&ie=UTF-8)，用户只能选择 Excel 文件来 “上传”，用户友好
* 这里我对 Modal 进行二次封装，属于锦上添花（主要目前我的业务要这样设计），可不管


使用如下：

```html
<Button type="primary" onClick={() => setLocalModalVisible(true)}>
  前端Excel转Data
</Button>
<LocalImportModal
  title="前端Excel转Data"
  visible={localModalVisible}
  onCancel={() => setLocalModalVisible(false)}
  onSubmit={data => setDataSource(data)}
/>
```

## 前端导出 Excel 文件

导出的难点在于写成 Excel 之后要立马下载，幸好 xlsx 的 `xlsx.writeFile` 直接帮我们实现这一步了。

```ts
/**
 * 导出 excel 文件
 * @param array JSON 数组
 * @param sheetName 第一张表名
 * @param fileName 文件名
 */
export function exportExcelFile(array: any[], sheetName = '表1', fileName = 'example.xlsx') {
  const jsonWorkSheet = xlsx.utils.json_to_sheet(array);
  const workBook: WorkBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet,
    }
  };
  return xlsx.writeFile(workBook, fileName);
}
```

使用的时候一个调用就可以了：

```html
<Button
  disabled={dataSource.length === 0}
  onClick={() => exportExcelFile(dataSource)}
  type="primary"
>
  前端Data转Excel
</Button>
```

## 后端导入 Excel 数据

为什么又要整个后端的导入导出呢？原因有三：

* 第一，xlsx 这个库还是挺大的，前端能不装这么大的库就不装了
* 第二，假如此时别的管理后台又要做数据导入导出，那上面的代码又要重新实现一次，我们更希望可以把这些通用的逻辑收敛到一个地方
* 第三，后端本来就是干脏活累活的地方，并不委屈

导入 Excel 数据的逻辑也很简单：用 [multer](https://www.npmjs.com/package/multer) 负责文件上传，拿到文件 `File` 后和上面的导入如法炮制即可。

先把上面的 `File` to `Data` 实现一遍，在 utils 里添加 `importExcelFromBuffer` 函数：

```js
/**
 * 读取 excel
 * @param fileBuffer
 * @returns {unknown[]}
 */
function importExcelFromBuffer(fileBuffer) {
  // 获取 workbook
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  // 获取第一张表名
  const firstSheetName = workbook.SheetNames[0];
  // 获取第一张表
  const firstSheet = workbook.Sheets[firstSheetName]
  // 获取数据
  return xlsx.utils.sheet_to_json(firstSheet);
}
```

再来实现个路由：

```js
var express = require('express');
var multer  = require('multer')
var {importExcelFromBuffer} = require('../utils')

var upload = multer()
var router = express.Router();

var excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

router.post('/excel_to_data', upload.single('excel'), (req, res) => {
  const data = importExcelFromBuffer(req.file.buffer);

  res.json({ data })
});
```


最后前端使用 Ant Design 的 `Upload` 组件上传 Excel 文件：

```tsx
const ServerImportModal: FC<Props> = (props) => {
  const {onImport, onSubmit, onOk, onCancel, ...modalProps} = props;

  const [excelData, setExcelData] = useState<any[]>([]);

  // 将文件转到服务端再解析数据
  const serverExcelToData = (info: UploadChangeParam) => {
    const { status, response } = info.file;
    if (status === 'done') {
      if (onImport) {
        onImport(response.data);
      }
      setExcelData(response.data);
    } else if (info.file.status === 'error') {
      console.error('error', info.file.name);
    }
  }

  const innerOnOk = (e: React.MouseEvent<HTMLElement>) => {
    if (onSubmit) onSubmit(excelData);
    if (onOk) onOk(e);
    if (onCancel) onCancel(e);
  }

  return (
    <Modal onOk={innerOnOk} onCancel={onCancel} {...modalProps}>
      <Dragger
        action={`${baseURL}/excel_to_data`}
        name="excel"
        accept={excelMimeType}
        onChange={serverExcelToData}
      >
        <Button type="primary" danger>后端Excel转Data</Button>
      </Dragger>
    </Modal>
  )
}
```

同样的，我这里也对 Modal 进行二次封装，你也可以选择先忽略它。前端需要注意这些点：

* `action` 则为我们刚刚实现的 /excel_to_data 接口
* `name` 为文件名
* `onChange` 为上传状态变化的回调，这里直接抄 Ant Design 的文档就好了，不 BB

使用时，和上面也是差不多的：

```html
<Button type="primary" danger onClick={() => setServerModalVisible(true)}>
  后端Excel转Data
</Button>
<ServerImportModal
  title="后端Excel转Data"
  visible={serverModalVisible}
  onCancel={() => setServerModalVisible(false)}
  onSubmit={data => setDataSource(data)}
/>
```

## 后端导出 Excel 文件

本质上就是传入 JSON 数组，生成 Excel 文件直接下载，这里的难点还是在于 **直接下载**。

不慌，先实现最基础 JSON 数组转 Excel 文件的工具函数：

```js
/**
 * 将数据转成 excel
 * @param array
 * @param sheetName
 * @returns {any}
 */
function exportExcelFromData(array, sheetName = '表1') {
  const jsonWorkSheet = xlsx.utils.json_to_sheet(array);
  const workBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet,
    }
  };
  return xlsx.write(workBook, {type: 'binary'});
}
```

和之前实现的差不多，唯一不同点是 `xlsx.writeFile` 变成了 `xlsx.write`，返回的是文件的二进制内容。**注意：`xlsx.writeFile` 的返回值是 `undefined`。**

再来实现路由：

```js
var excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

router.post('/data_to_excel', (req, res) => {
  const {data} = req.body;

  const fileBuffer = exportExcelFromData(data, '表1');

  res.writeHead(200, [['Content-Type', excelMimeType]]);
  res.end(new Buffer(fileBuffer, 'binary'));
})
```

这里的关键点是 `Content-Type` 设置为 Excel 的 [MIME Type](https://www.google.com.hk/search?q=excel+mime+type&oq=excel+mime+type&aqs=chrome.0.69i59j0i512l4j0i22i30j69i60l2.3920j0j7&sourceid=chrome&ie=UTF-8)，这样返回的内容就是 Excel 的二进制内容了。

最后，来看看前端是怎么接住这个 Excel 文件的：

```tsx
import {saveAs} from 'file-saver'

const http = axios.create({baseURL});

const serverDataToExcel = async () => {
  const response = await http.post('/data_to_excel', {
    data: dataSource,
  }, { responseType: 'blob' })

  saveAs(response.data, "test.xlsx");
}
```

接住 Excel 文件的关键点在于设定 axios 的 `responseType` 为 `blob`，这个属性是一个经常被人忽略的属性，实际上功能非常强大，比如可以设置为 `stream` 来操作 **流** 来做一些高级玩法。

回到主题，拿到二进制文件后，直接用 `file-saver` 这个库来实现 **直接下载** 功能。

**直接下载** 也不是什么黑科技，其实就是创建一个临时的 `<a>` 标签，把 `url` 填到 `href`，再用 JS 点击一下：

```js
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}
```

不过，这里的场景不允许我们用上面的方法，因为生成的 Excel 文件都以 `二进制` 返回了，而不是一个 **URL**，所以只能用 `file-saver` 来实现直接下载。

到此，Excel 的导入导出，前端与后端的实现都 **O** 了。

## 数据清洗

一般来说，用户上传的 Excel 文件表头都是中文的，所以用 `xlsx` 直接解析出来对象的 `key` 都是中文，比如：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/098a7f13551d4a198a94eed4e530a322~tplv-k3u1fbpfcp-watermark.image)

```json
{
  "姓名": 'Jack',
  "年龄": 11
}
```

而我们的程序一般都以英文作为 `key`，比如：

```json
{
  "name": 'Jack',
  "age": 11
}
```

所以在数据导入的时候还要有一步将这些 `key` 从中文传成中英文，而在导出 Excel 时则将英文转成中文：

```ts
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
```

在拼装和组装对象时，`reduce` 是一个非常好用的函数。使用的时候，我们只需要传入 **原数据** 和 **key 的映射关系** 即可：

```ts
// key 的映射关系
const keyMaps = {
  姓名: 'name',
  年龄: 'age'
}

// 中文传英文
const data = convertKeys<ExcelRamenReview, RamenReview>(excelData, keyMaps)
```

## 总结

最后总结一下：

* Workbook 就是 Excel 文档，一个 Workbook 下有多个 Sheet，一般来说只操作第一个 Sheet
* `xlsx` 这个库只需要关注 `writeFile`, `readFile`, `write`, `sheet_to_json` 和 `json_to_sheet` 就够用了
* **直接下载功能** 可以用 `file-saver` 一步到位，也可以使用添加临时 `<a>` 标签来模拟下载行为。但由于在接住 Excel 的时候，返回的是临时文件的二进制，所以，用 `file-saver` 会比较方便
* 前端要接住二进制的文件，需要在 `axios` 的 `responseType` 设置为 `blob`
* Ant Design 的 Upload 组件非常强大，要善用其给的 `props`，比如 `accept`, `action`, `name`, `customRequest` 等，比如前端解析就是用 `customRequest` “假上传” 来获取 Excel 文件

总的来说，`xlsx` 这个库还是挺简单的，只是文档比较复杂，像样的 Demo 没几个。

上面也仅实现了 **一个 Sheet** 的情况，对于多个 Sheet 的情况，大家做个 For 循环就可以了。一般来说管理后面的 Excel 导入也没多少花里胡哨的操作，上面这 4 种情况基本能包含 90% 的应用场景了。

我把上面这 4 种场景的实现都放在 [Github 的 learn-xlsx](https://github.com/haixiangyan/learn-xlsx) 上了。除此之外，我还用 [Jest](https://jestjs.io/) 写了 **单元测试**，用 [Cypress](https://www.cypress.io/) 和 [supertest](https://www.npmjs.com/package/supertest) 做 **e2e 测试**，感兴趣的可以 clone 下来直接白嫖哦~
