import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';

ReactDOM.render((
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>),
  document.getElementById('root')
);
