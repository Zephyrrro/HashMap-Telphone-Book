import { HashItem, TelProps, KeyType, TableItem } from "./types";

export default class HashMap {
  private limit: number;
  private table: Array<HashItem | null>;
  private count: number;
  private prime: number;

  constructor(minSize: number) {
    this.limit = minSize;
    this.table = [];
    this.count = 0;
    this.prime = generateMaxPrime(minSize);
  }

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
   * 哈希表添加数据
   *
   * @param {KeyType} keyType
   * @param {string} key
   * @param {TelData} value
   * @memberof HashTable
   */
  put(keyType: KeyType, key: string, value: TelProps) {
    let index = this.getHash(key);
    while (
      !!this.table[index] &&
      (this.table[index] as HashItem).keyType !== keyType &&
      (this.table[index] as HashItem).key !== key
    ) {
      index = (index + 1) % this.limit;
    }
    !this.table[index] && this.count++;
    this.table[index] = { keyType, key, value };

    if (this.count > this.limit * 0.75) {
      const newSize = this.limit * 2;
      this.prime = generateMaxPrime(newSize);
      this.resize(newSize);
    }
  }

  /**
   * 哈希表获取数据
   *
   * @param {KeyType} keyType
   * @param {string} key
   * @returns
   * @memberof HashTable
   */
  get(keyType: KeyType, key: string): TelProps | null {
    let index = this.getHash(key);
    while (!!this.table[index]) {
      if (
        (this.table[index] as HashItem).keyType === keyType &&
        (this.table[index] as HashItem).key === key
      ) {
        return (this.table[index] as HashItem).value;
      }
      index = (index + 1) % this.limit;
    }
    return null;
  }

  /**
   * 哈希表删除数据
   *
   * @param {KeyType} keyType
   * @param {string} key
   * @memberof HashTable
   */
  remove(keyType: KeyType, key: string): TelProps | null {
    let index = this.getHash(key);
    while (!!this.table[index]) {
      if (
        (this.table[index] as HashItem).keyType === keyType &&
        (this.table[index] as HashItem).key === key
      ) {
        const res = this.table[index] as HashItem;
        this.table[index] = null;
        this.count--;

        if (this.limit > 10 && this.count < this.limit * 0.25) {
          const newSize = Math.floor(this.limit / 2);
          this.prime = generateMaxPrime(newSize);
          this.resize(newSize);
        }

        return res.value;
      }
      index = (index + 1) % this.limit;
    }
    return null;
  }

  resize(newSize: number) {
    const oldTable = this.table;

    this.table = [];
    this.count = 0;
    this.limit = newSize;

    for (let i = 0; i < oldTable.length; i++) {
      const data = oldTable[i];
      if (!data) {
        continue;
      }

      this.put(data.keyType, data.key, data.value);
    }
  }

  size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0;
  }

  clear() {
    this.table = [];
    this.count = 0;
  }

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
