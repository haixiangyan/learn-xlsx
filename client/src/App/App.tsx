import {FC, useState} from "react";
import {Button, Divider, Table, Upload} from "antd";
import {ExcelRamenReview, RamenReview} from "./types";
import {columns, excelMimeType, keyMaps} from "./constants";
import styles from './styles.module.scss';
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {convertKeys, exportExcel, importExcel} from "./utils";
import {RcFile} from "antd/es/upload";
import {UploadChangeParam} from "antd/lib/upload/interface";
import axios from "axios";
import { saveAs } from 'file-saver';

const http = axios.create({baseURL: 'http://localhost:4200'});

const App: FC = () => {
  const [dataSource, setDataSource] = useState<RamenReview[]>([]);

  const customRequest = async (options: RcCustomRequestOptions) => {
    const {file} = options;

    const excelData = await importExcel<ExcelRamenReview>(file as RcFile);
    const data = convertKeys<ExcelRamenReview, RamenReview>(excelData, keyMaps);

    setDataSource(data);
  }

  const batchExport = () => {
    exportExcel(dataSource.map(item => ({
      ID: item.id,
      品牌: item.brand,
      国家: item.country,
      类型: item.category,
      风格: item.style,
      评分: item.rating,
    })));
  }

  const onUploadChange = (info: UploadChangeParam) => {
    const { status, response } = info.file;
    if (status === 'done') {
      setDataSource(response.data);
    } else if (info.file.status === 'error') {
      console.error('error', info.file.name);
    }
  }

  const convertExcel = async () => {
    const response = await http.post('/data_to_excel', {
      data: dataSource,
    }, { responseType: 'blob' })

    saveAs(response.data, "test.xlsx");
  }

  return (
    <div className={styles.app}>
      <h1>xlsx 导入/导出</h1>

      <div>
        <Upload accept={excelMimeType} customRequest={customRequest} showUploadList={false}>
          <Button type="primary">前端Excel转Data</Button>
        </Upload>

        <Divider type="vertical"/>

        <Button
          disabled={dataSource.length === 0}
          onClick={batchExport}
          type="primary"
        >
          前端Data转Excel
        </Button>

        <Divider type="vertical"/>

        <Upload
          action="http://localhost:4200/excel_to_data"
          name="excel"
          accept={excelMimeType}
          onChange={onUploadChange}
          showUploadList={false}
        >
          <Button type="primary" danger>后端Excel转Data</Button>
        </Upload>

        <Divider type="vertical"/>

        <Button disabled={dataSource.length === 0} type="primary" danger onClick={convertExcel}>
          后端Data转Excel
        </Button>
      </div>

      <Divider />

      <Table rowKey="id" bordered dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default App;
