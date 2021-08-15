import {FC, useState} from "react";
import {Button, Divider, Table, Upload} from "antd";
import {ExcelRamenReview, RamenReview} from "./types";
import {columns, keyMaps} from "./constants";
import styles from './styles.module.scss';
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {convertKeys, exportExcel, importExcel} from "./utils";
import {RcFile} from "antd/es/upload";

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

  return (
    <div className={styles.app}>
      <h1>xlsx 导入/导出</h1>

      <div>
        <Upload customRequest={customRequest} showUploadList={false}>
          <Button type="primary">Excel导入</Button>
        </Upload>
        <Button
          disabled={dataSource.length === 0}
          style={{ marginLeft: 12 }}
          onClick={batchExport}
          type="primary"
        >
          导出Excel
        </Button>
      </div>

      <Divider />

      <Table rowKey="id" bordered dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default App;
