const Xlsx = require('xlsx')

function importExcel(path, range) {
    // 获取 workbook
    const workbook = Xlsx.read(path, { type: 'file' });
    // 获取第一张表名
    const firstSheetName = workbook.SheetNames[0];
    // 获取第一张表
    const firstSheet = workbook.Sheets[firstSheetName]

    console.log('first sheet', firstSheet)

    const data = Xlsx.utils.sheet_to_json(firstSheet, { range });

    console.log(data);
}

importExcel('./excel.xlsx', 'A1:G1000')
