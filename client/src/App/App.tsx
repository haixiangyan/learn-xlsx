import {FC, useState} from "react";
import {Button, Divider, Table} from "antd";
import {RamenReview} from "./types";
import {columns} from "./constants";
import styles from './styles.module.scss';

const App: FC = () => {
  const [dataSource, setDataSource] = useState<RamenReview[]>([]);

  return (
    <div className={styles.app}>
      <h1>xlsx 导入/导出</h1>
      <Button type="primary">从Excel导入</Button>
      <Divider />
      <Table bordered dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default App;
