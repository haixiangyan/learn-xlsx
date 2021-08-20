var express = require('express');
var multer  = require('multer')
var {convertKeys} = require("../utils");
var {getJsonFromExcel, getExcelFromJson} = require('../utils')

var upload = multer()
var router = express.Router();

var excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

router.post('/excel_to_data', upload.single('excel'), (req, res) => {
  const data = getJsonFromExcel(req.file.buffer);

  const returnData = convertKeys(data, {
    ID: 'id',
    品牌: 'brand',
    类型: 'category',
    风格: 'style',
    国家: 'country',
    评分: 'rating',
  });

  res.json({ data: returnData })
});

router.post('/data_to_excel', (req, res) => {
  const {data} = req.body;

  const binaryContent = getExcelFromJson(data, '表1');

  res.writeHead(200, [['Content-Type', excelMimeType]]);
  res.end(new Buffer(binaryContent, 'binary'));
})

module.exports = router;
