import {FC, useState} from "react";
import {Button, Modal, ModalProps, Upload} from "antd";
import {baseURL, excelMimeType} from "../../constants";
import {UploadChangeParam} from "antd/lib/upload/interface";
import * as React from "react";

interface Props extends ModalProps {
  onImport?: (data: any[]) => void;
  onSubmit?: (data: any[]) => void;
}

const {Dragger} = Upload;

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
        data-cy="upload-excel-input"
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

export default ServerImportModal;
