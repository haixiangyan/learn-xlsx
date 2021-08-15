import {FC, useState} from "react";
import {Button, Divider, Table, Upload} from "antd";
import {RamenReview} from "./types";
import {columns} from "./constants";
import styles from './styles.module.scss';
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {importExcel} from "./utils";
import {RcFile} from "antd/es/upload";

const App: FC = () => {
  const [dataSource, setDataSource] = useState<RamenReview[]>([]);

  const customRequest = async (options: RcCustomRequestOptions) => {
    const {file} = options;

    const data = await importExcel(file as RcFile);

    console.log(data);
  }

  return (
    <div className={styles.app}>
      <h1>xlsx 导入/导出</h1>

      <Upload customRequest={customRequest}>
        <Button type="primary">从Excel导入</Button>
      </Upload>
      <Divider />
      <Table bordered dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default App;
