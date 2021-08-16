import {FC} from "react";
import {Button, Upload} from "antd";
import {baseURL, excelMimeType} from "../../constants";
import {UploadChangeParam} from "antd/lib/upload/interface";

interface Props {
  onImport: (data: any[]) => void;
}

const ServerExcelImport: FC<Props> = (props) => {
  const {onImport} = props;

  const serverExcelToData = (info: UploadChangeParam) => {
    const { status, response } = info.file;
    if (status === 'done') {
      onImport(response.data);
    } else if (info.file.status === 'error') {
      console.error('error', info.file.name);
    }
  }

  return (
    <Upload
      action={`${baseURL}/excel_to_data`}
      name="excel"
      accept={excelMimeType}
      onChange={serverExcelToData}
    >
      <Button type="primary" danger>后端Excel转Data</Button>
    </Upload>
  )
}

export default ServerExcelImport;
