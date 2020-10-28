import TelData from "./TelData";
import { HashItem, TelProps, KeyType, TableItem } from "./types";

export default class HashMap {
  private limit: number; //  表的最大长度
  private table: Array<HashItem | null>; //  表
  private count: number; //  当前表的长度
  private prime: number; //  用于除留取余法的质数

  constructor(maxSize: number) {
    this.limit = maxSize;
    this.table = [];
    this.count = 0;
    this.prime = generateMaxPrime(maxSize); //  计算小于或等于当前表最大长度的最大质数
  }

  /**
   * 基数转换法与除留取余法相结合的哈希函数
   *
   * @param {string} str key值
   * @returns {number}
   * @memberof HashMap
   */
  getHash(str: string): number {
    let hash = 0;
    //  基数转换法将字符串转为十进制数
    for (let i = 0; i < str.length; i++) {
      hash = 37 * hash + str.charCodeAt(i);
    }
    //  除留取余法得到hash值
    return hash % this.prime;
  }

  /**
   * 哈希表插入/更新数据
   *
   * @param {KeyType} keyType key类型
   * @param {string} key key值
   * @param {TelProps} value 数据
   * @memberof HashMap
   */
  put(keyType: KeyType, key: string, value: TelProps) {
    let index = this.getHash(key);

    //  若散列位置已有数据，且数据的key类型和key与当前插入的数据不同，则表示发生了冲突，利用线性探测法解决冲突
    while (
      !!this.table[index] &&
      (this.table[index] as HashItem).keyType !== keyType &&
      (this.table[index] as HashItem).key !== key
    ) {
      index = (index + 1) % this.limit;
    }

    //  散列位置无数据，则表示新增数据，表长+1，否则不执行
    !this.table[index] && this.count++;

    //  更新/插入数据
    this.table[index] = { keyType, key, value };

    //  装载因子 > 0.75时扩容
    if (this.count > this.limit * 0.75) {
      const newSize = this.limit * 2;
      this.resize(newSize);
    }
  }

  /**
   * 哈希表查找数据
   *
   * @param {KeyType} keyType key类型
   * @param {string} key key值
   * @returns {(TelProps | null)}
   * @memberof HashMap
   */
  get(
    keyType: KeyType,
    key: string
  ): { value: TelData | null; searchLength: number } {
    let index = this.getHash(key);
    let searchLength = 1;

    //  散列位置存在数据，判断是否为查找的数据
    while (!!this.table[index]) {
      if (
        (this.table[index] as HashItem).keyType === keyType &&
        (this.table[index] as HashItem).key === key
      ) {
        return { value: (this.table[index] as HashItem).value, searchLength };
      }
      index = (index + 1) % this.limit;
      searchLength++; //  搜索长度+1
    }

    //  查无此项，返回Null
    return { value: null, searchLength };
  }

  /**
   * 哈希表删除数据
   *
   * @param {KeyType} keyType key类型
   * @param {string} key key值
   * @memberof HashTable
   */
  remove(keyType: KeyType, key: string): TelProps | null {
    let index = this.getHash(key);

    //  散列位置存在数据，判断是否为查找的数据
    while (!!this.table[index]) {
      if (
        (this.table[index] as HashItem).keyType === keyType &&
        (this.table[index] as HashItem).key === key
      ) {
        //  查找到欲删除的数据则删除
        const res = this.table[index] as HashItem;
        this.table[index] = null;
        this.count--;

        //  删除后 装载因子 < 0.25，则缩减容量
        if (this.limit > 10 && this.count < this.limit * 0.25) {
          const newSize = Math.floor(this.limit / 2);
          this.resize(newSize);
        }

        return res.value;
      }
      index = (index + 1) % this.limit;
    }

    //  不存在欲删除的项
    return null;
  }

  /**
   * 哈希表容量重整
   *
   * @param {number} newSize 新容量
   * @memberof HashMap
   */
  resize(newSize: number) {
    const oldTable = this.table;  //  保存旧表

    //  重新初始化
    this.table = [];
    this.count = 0;
    this.limit = newSize;
    this.prime = generateMaxPrime(newSize);

    //  遍历旧表，将原有数据装入新表
    for (let i = 0; i < oldTable.length; i++) {
      const data = oldTable[i];
      if (!data) {
        continue;
      }

      this.put(data.keyType, data.key, data.value);
    }
  }

  /**
   * 哈希表当前表长
   *
   * @returns
   * @memberof HashMap
   */
  size() {
    return this.count;
  }

  /**
   * 哈希表是否为空
   *
   * @returns
   * @memberof HashMap
   */
  isEmpty() {
    return this.count === 0;
  }

  /**
   * 清空哈希表
   *
   * @memberof HashMap
   */
  clear() {
    this.table = [];
    this.count = 0;
  }

  /**
   * 哈希表遍历
   *
   * @returns {Array<TableItem>}
   * @memberof HashMap
   */
  getAllData(): Array<TableItem> {
    const result: Array<TableItem> = [];
    this.table.forEach(item => {
      if (item) {
        const { key, keyType, value } = item;
        result.push({ key, keyType, ...value });
      }
    });
    return result;
  }
}

const generateMaxPrime = (max: number): number => {
  for (let i = max; i >= 2; i--) {
    if (isPrime(i)) return i;
  }
  return 2;
};

const isPrime = (num: number): boolean => {
  if (num <= 1) {
    return false;
  }

  for (let i = 2; i < Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }

  return true;
};
