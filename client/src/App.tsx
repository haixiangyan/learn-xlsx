import {FC, useState} from "react";
import {Button, Divider, Table} from "antd";
import {RamenReview} from "./types";
import {baseURL, columns} from "./constants";
import {exportExcelFile} from "./utils";
import axios from "axios";
import {saveAs} from 'file-saver';
import LocalImportModal from "./components/LocalImportModal";
import ServerImportModal from "./components/ServerImportModal";

const http = axios.create({baseURL});

const App: FC = () => {
  const [localModalVisible, setLocalModalVisible] = useState<boolean>(false);
  const [serverModalVisible, setServerModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<RamenReview[]>([]);

  const localDataToExcel = () => {
    exportExcelFile(dataSource.map(item => ({
      ID: item.id,
      品牌: item.brand,
      国家: item.country,
      类型: item.category,
      风格: item.style,
      评分: item.rating,
    })));
  }

  const serverDataToExcel = async () => {
    const response = await http.post('/data_to_excel', {
      data: dataSource.map(item => ({
        ID: item.id,
        品牌: item.brand,
        国家: item.country,
        类型: item.category,
        风格: item.style,
        评分: item.rating,
      })),
    }, { responseType: 'blob' })

    saveAs(response.data, "test.xlsx");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>xlsx 导入/导出</h1>

      <div>
        <Button data-cy="frontend-excel-data" type="primary" onClick={() => setLocalModalVisible(true)}>
          前端Excel转Data
        </Button>
        <LocalImportModal
          title="前端Excel转Data"
          visible={localModalVisible}
          onCancel={() => setLocalModalVisible(false)}
          onSubmit={data => setDataSource(data)}
        />

        <Divider type="vertical"/>

        <Button
          data-cy="frontend-data-excel"
          disabled={dataSource.length === 0}
          onClick={localDataToExcel}
          type="primary"
        >
          前端Data转Excel
        </Button>

        <Divider type="vertical"/>

        <Button data-cy="backend-excel-data" type="primary" danger onClick={() => setServerModalVisible(true)}>
          后端Excel转Data
        </Button>
        <ServerImportModal
          title="后端Excel转Data"
          visible={serverModalVisible}
          onCancel={() => setServerModalVisible(false)}
          onSubmit={data => setDataSource(data)}
        />

        <Divider type="vertical"/>

        <Button
          data-cy="backend-data-excel"
          disabled={dataSource.length === 0}
          type="primary"
          danger
          onClick={serverDataToExcel}
        >
          后端Data转Excel
        </Button>
      </div>

      <Divider />

      <Table rowKey="id" bordered dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default App;
