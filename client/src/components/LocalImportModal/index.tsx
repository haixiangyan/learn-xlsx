import {FC, useState} from "react";
import {Button, Modal, ModalProps, Upload} from "antd";
import {excelMimeType, keyMaps} from "../../constants";
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {convertKeys, importExcel} from "../../utils";
import {ExcelRamenReview, RamenReview} from "../../types";
import {RcFile} from "antd/es/upload";
import * as React from "react";

interface Props extends ModalProps {
  onImport?: (data: any[]) => void;
  onSubmit?: (data: any[]) => void;
}

const {Dragger} = Upload;

const LocalImportModal: FC<Props> = (props) => {
  const {onImport, onSubmit, onCancel, onOk, ...modalProps} = props;

  const [excelData, setExcelData] = useState<any[]>([]);

  // 获取文件并解析
  const localExcelToData = async (options: RcCustomRequestOptions) => {
    const {file, onSuccess, onError} = options;

    try {
      // xlsx 导入 excel
      const excelData = await importExcel<ExcelRamenReview>(file as RcFile);
      // 转换 key
      const data = convertKeys<ExcelRamenReview, RamenReview>(excelData, keyMaps);
      // 设置 data
      setExcelData(data);

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

export default LocalImportModal;
