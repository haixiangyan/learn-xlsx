import {FC, useState} from "react";
import {Button, Divider, Table, Upload} from "antd";
import {ExcelRamenReview, RamenReview} from "./types";
import {columns, keyMaps} from "./constants";
import styles from './styles.module.scss';
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {convertKeys, importExcel} from "./utils";
import {RcFile} from "antd/es/upload";

const App: FC = () => {
  const [dataSource, setDataSource] = useState<RamenReview[]>([]);

  const customRequest = async (options: RcCustomRequestOptions) => {
    const {file} = options;

    const excelData = await importExcel<ExcelRamenReview>(file as RcFile);
    const data = convertKeys<ExcelRamenReview, RamenReview>(excelData, keyMaps);

    setDataSource(data);
  }

  return (
    <div className={styles.app}>
      <h1>xlsx 导入/导出</h1>

      <Upload customRequest={customRequest}>
        <Button type="primary">从Excel导入</Button>
      </Upload>
      <Divider />
      <Table rowKey="id" bordered dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default App;
