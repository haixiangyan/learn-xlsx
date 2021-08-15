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
