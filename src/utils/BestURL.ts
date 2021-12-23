/*
 * @Description: 处理url字符串。对其进行增删改查。改和增用的同一个方法
 * @Author: Friends233
 */

export default class BestURL {
  public params = {};
  public url = "";

  public constructor(url: string) {
    if (Object.prototype.toString.call(url) === "[object String]") {
      this.url = url;
      this.urlToParams();
    }
  }

  public delParams(name: string) {
    while (this.params.hasOwnProperty(name)) {
      const reg = new RegExp(`[\\?|&]*${name}=[^&^?^=^#]*&*`, "g");
      const matchs = this.url.match(reg);
      for (const item of matchs) {
        const head = item.substr(0, 1);
        const tail = item.substr(-1);
        if ((head === "?" && tail === "&") || (head === "&" && tail === "&")) {
          // 是第一个参数并且后面还有其他参数 或者 不是第一个参数，并且后面还有参数
          // 删掉后面的&和对应参数
          this.url = this.url.replace(item.substr(1), "");
        } else if (head === "&" || head === "?") {
          // 是最后一个参数 或者 是第一个参数，并且后面没有其他参数
          // 直接删掉对应参数
          this.url = this.url.replace(item, "");
        }
      }
      this.urlToParams();
    }
    return this.url;
  }

  public setParams(name: string, value: string | number) {
    if (this.params.hasOwnProperty(name)) {
      const reg = new RegExp(`${name}=[^&^?^=^#]*`, "g");
      this.url = this.url.replace(reg, `${name}=${value}`);
    } else {
      this.addParams(name, value);
    }
    this.urlToParams();
    return this.url;
  }
  public getParams(key: string) {
    return this.params[key];
  }

  private urlToParams() {
    const reg = /(\w+=[^&^?^=^#]*)/g;
    const matchs = this.url.match(reg);
    const res = {};
    matchs?.forEach((item) => {
      let temp = item?.split("=");
      if (!res[temp[0]]) {
        res[temp[0]] = temp[1] || "";
      }
    });
    this.params = res;
  }

  private addParams(name: string, value: string | number) {
    const idx = this.url.indexOf("?");
    if (idx !== -1) {
      // 有参数就放在参数后面
      const reg = /\?\w+=[^&^?^=^#]*#?/;
      this.url = this.url.replace(reg, (str) => {
        if (str.indexOf("#") !== -1) {
          return `${str.replace("#", "")}&${name}=${value}#`;
        } else {
          return `${str}&${name}=${value}`;
        }
      });
    } else {
      // 没有参数就放在最后面
      this.url += `?${name}=${value}`;
    }
    this.urlToParams();
  }

  // 放到锚点后面的参数
  private addParamsCopy(name: string, value: string | number) {
    if (this.url.lastIndexOf("=") > this.url.lastIndexOf("#")) {
      // 锚点后面有参数或者没有锚点
      this.url += "&";
    } else if (this.url.lastIndexOf("=") === this.url.lastIndexOf("#")) {
      // 没有锚点，没有参数
      if (this.url.lastIndexOf("=") === -1) {
        this.url += "?";
      } else {
        this.url += "&";
      }
    } else {
      // 锚点后面没有参数
      this.url += "?";
    }
    this.url += `${name}=${value}`;
  }
}

const test2 = "https://www.runoob.com/regexp/regexp-syntax.html?aa=中文";
const besturl = new BestURL(test2);
// besturl.setParams("aa", 23);
console.log(besturl);
new BestURL(test2).setParams("aa", 23);
