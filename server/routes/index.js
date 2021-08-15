var express = require('express');
var multer  = require('multer')
var {convertKeys} = require("../utils");
var { importExcelFromBuffer } = require('../utils')

var upload = multer()
var router = express.Router();

router.post('/', upload.single('excel'), (req, res) => {
  const data = importExcelFromBuffer(req.file.buffer);

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

module.exports = router;
