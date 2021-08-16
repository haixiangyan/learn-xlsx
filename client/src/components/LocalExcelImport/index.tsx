import {FC} from "react";
import {Button, Upload} from "antd";
import {excelMimeType, keyMaps} from "../../constants";
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {convertKeys, importExcel} from "../../utils";
import {ExcelRamenReview, RamenReview} from "../../types";
import {RcFile} from "antd/es/upload";

interface Props {
  onImport: (data: any[]) => void;
}

const LocalExcelImport: FC<Props> = (props) => {
  const {onImport} = props;

  // 获取文件并解析
  const localExcelToData = async (options: RcCustomRequestOptions) => {
    const {file, onSuccess, onError} = options;

    try {
      // xlsx 导入 excel
      const excelData = await importExcel<ExcelRamenReview>(file as RcFile);
      // 转换 key
      const data = convertKeys<ExcelRamenReview, RamenReview>(excelData, keyMaps);

      onImport(data);

      if (onSuccess) onSuccess(data, new XMLHttpRequest());
    } catch (e) {
      if (onError) onError(e)
    }
  }

  return (
    <Upload accept={excelMimeType} customRequest={localExcelToData}>
      <Button type="primary">前端Excel转Data</Button>
    </Upload>
  )
}

export default LocalExcelImport;
