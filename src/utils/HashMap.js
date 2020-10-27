export default class HashMap {
  size;
  table;
  count;
  prime;

  constructor(minSize) {
    this.size = minSize;
    this.table = [];
    this.count = 0;
    this.prime = generateMaxPrime(minSize);
  }

  getHash(str) {
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
   * @param {"user" | "phone"} keyType
   * @param {String} key
   * @param {TelData} value
   * @memberof HashTable
   */
  put(keyType, key, value) {
    let index = this.getHash(key);
    while (!!this.table[index]) {
      index = (index + 1) % this.size;
    }
    this.table[index] = { keyType, key, value };
    this.count++;

    if (this.count > this.size * 0.75) {
      const newSize = this.size * 2;
      const newPrime = generateMaxPrime(newSize);
      this.prime = newPrime;
      this.resize(newPrime)
    }
  }

  /**
   * 哈希表获取数据
   *
   * @param {"user" | "phone"} keyType
   * @param {String} key
   * @returns
   * @memberof HashTable
   */
  get(keyType, key) {
    let index = this.getHash(key);
    while (!!this.table[index]) {
      if (
        this.table[index].keyType === keyType &&
        this.table[index].key === key
      ) {
        return this.table[index].value;
      }
      index = (index + 1) % this.size;
    }
    return null;
  }

  /**
   * 哈希表删除数据
   *
   * @param {"user" | "phone"} keyType
   * @param {String} key
   * @memberof HashTable
   */
  remove(keyType, key) {
    let index = this.getHash(key);
    while (!!this.table[index]) {
      if (
        this.table[index].keyType === keyType &&
        this.table[index].key === key
      ) {
        const res = this.table[index];
        this.table[index] = null;
        this.count--;

        if (this.size > 30 && this.count < this.size * 0.25) {
          const newSize = Math.floor(this.size / 2);
          const newPrime = generateMaxPrime(newSize);
          this.prime = newPrime;
          this.resize(newPrime)
        }

        return res.value;
      }
      index = (index + 1) % this.size;
    }
    return null;
  }

  resize(newSize) {
    const oldTable = this.table;

    this.table = [];
    this.count = 0;
    this.size = newSize;

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

  getAllData() {
    const result = [];
    this.table.forEach(item => {
      if (item) {
        const { key, keyType, value } = item;
        result.push({ key, keyType, ...value });
      }
    });
    return result;
  }
}

const generateMaxPrime = max => {
  for (let i = max; i >= 2; i--) {
    if (isPrime(i)) return i;
  }
  return 2;
};

const isPrime = num => {
  if (num <= 1) {
    return false;
  }

  for (let i = 2; i < Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }

  return true;
};
