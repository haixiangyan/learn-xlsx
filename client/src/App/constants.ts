import {ColumnsType} from "antd/es/table";
import {RamenReview} from "./types";

export const columns: ColumnsType<RamenReview> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: '类型',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '风格',
    dataIndex: 'style',
    key: 'style',
  },
  {
    title: '国家',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: '评分',
    dataIndex: 'rating',
    key: 'rating',
  },
]

export const keyMaps = {
  ID: 'id',
  品牌: 'brand',
  类型: 'category',
  风格: 'style',
  国家: 'country',
  评分: 'rating',
}

export const excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
