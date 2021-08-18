import {convertKeys} from "./index";

describe('convertKeys', () => {
  const rawData = [{ name: 'Jack', age: 11 }, { name: 'mama', age: 22 }]

  it('可以转换部分 key', () => {
    const keysMap = { name: '姓名' }
    const result = convertKeys(rawData, keysMap);
    const expected = [{ 姓名: 'Jack', age: 11 }, { 姓名: 'mama', age: 22 }]
    expect(result).toEqual(expected);
  })
  it('正常转换所有 key', () => {
    const keysMap = { name: '姓名', age: '年龄' }
    const result = convertKeys(rawData, keysMap);
    const expected = [{ 姓名: 'Jack', 年龄: 11 }, { 姓名: 'mama', 年龄: 22 }]
    expect(result).toEqual(expected);
  })
  it('可以保留原有数据', () => {
    const result = convertKeys(rawData, {});
    expect(result).toEqual(rawData);
  })
})

export default {}
