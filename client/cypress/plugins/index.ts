/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import * as fs from "fs";
import rimraf from 'rimraf';
import {importExcelFromBuffer} from "../../src/utils";

/**
 * @type {Cypress.PluginConfig}
 */

async function deleteFile(filePath: string) {
  const fileExist = fs.existsSync(filePath);
  if (fileExist) {
    fs.unlinkSync(filePath);
  }
  return fileExist
}

async function deleteFolder(folderPath: string) {
  const folderExist = fs.existsSync(folderPath);
  if (folderExist) {
    rimraf.sync(folderPath);
  }
  return folderExist;
}

async function readDataFromExcel(excelPath: string) {
  if (fs.existsSync(excelPath)) {
    const excelFileBuffer = fs.readFileSync(excelPath);
    return importExcelFromBuffer(excelFileBuffer);
  }
  return [];
}

export default (on: any) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    deleteFile,
    deleteFolder,
    readDataFromExcel
  })
}
