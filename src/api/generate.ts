/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
const fs = require("fs");
const path = require("path");
const http = require("http");
const child_process = require("child_process");

// import fs from 'fs';
// import path from 'path';
// import http from 'http';

// TODO: 加载指定tag
// TODO: 一个接口存在多个tag中的时候
// TODO: 部分更新的时候的处理  -暂无处理方案 - -
// declare let __dirname: string;

class GenerateApis {
  private url = "http://10.10.77.129:8080"; // 接口的地址
  private API_PATH = path.resolve(__dirname, "./modules_generate"); // 接口保存的路径
  // 当前处理的group
  private group: Group;
  // 获取所有接口组
  public async getAll() {
    // 获取文档模块列表
    let data = await get(`${this.url}/swagger-resources`);

    data.forEach(async group => {
      await this.getGroup(`${this.url}${group.url}`, group.name);
    });
    // fs.mkdirSync('./modules');
  }
  // 获取某个组的数据
  public async getGroup(url: string, name?: string) {
    try {
      // 解析url 获得
      this.group = await get(url);
      console.log(url, 1, "模块");

      this.group.name = name; // || (/group=(.*)/.test(url) && decodeURI(url.match(/group=(.*)/)[1]));
      let { tags, paths } = this.group;
      if (!paths || !tags) {
        return;
      }
      // 一个module为一个文件
      let modules: Module[] = tags.map(tag => ({ ...tag, interfaces: [] }));
      // 找不到tag的接口放这里面
      modules.push({
        name: "other",
        description: "找不到的模块的接口",
        interfaces: []
      });

      const urls = Object.keys(paths); // 获取url路径
      // 将一个模块接口.归类到自己对应的module
      urls.forEach(url => {
        // get post等
        let methods = Object.keys(paths[url]);
        let interfaces: Interface[] = methods.map(method => ({
          ...paths[url][method],
          method: method.toLocaleLowerCase(),
          url
        }));
        interfaces.forEach(item => {
          let module =
            modules.find(module => item.tags.includes(module.name)) || modules.find(module => module.name === "other");
          module.interfaces.push(item);
          module.lastUrl = url;
        });
      });
      // 写入模块文件
      this.writeModules(modules);
    } catch (e) {
      console.error(e);
    }
  }
  // 格式注释文本
  private formatText(text: string) {
    // 文本说明中的 */会影响注释。替换掉
    return text ? String(text).replace(/\*\//g, "*\\") : "";
  }

  // 将某个接口写入模板
  private insertApi(api: Interface) {
    let url = api.url;
    console.log(url);

    let params: string[] = [];
    // 有{id}这样的接口查询的时候
    let reg = /{(.*?)}/g;
    if (reg.test(url)) {
      url = url.replace(reg, id => `$${id}`);
      // 讲参数拼接进入接口参数
      params = url.match(reg).map(str => str.replace(/[{}]/g, "") + ": string | number");
    }
    let fnName = api.operationId;
    // post 里面有query时的处理
    if (api.method === "post" || api.method === "put") {
      params.concat(
        ...(api.parameters || []).filter(item => item.in === "query").map(item => item.name + ": string | number")
      );
    }
    // 增加默认的参数
    params.push(...["params?", "options?"]);

    // 生成请求的function字符串
    let apiStr = `
      /**
       * @description ${this.formatText(api.summary)}
       */
      export function ${fnName}(${params.join(", ")}) {
        return request.${api.method}(\`${this.group.basePath}${url}\`, params, options );
      }`;
    return apiStr;
  }
  // 写一个模块下的接口接口到一个文件
  private writeModules(modules: Module[]) {
    modules.forEach(module => {
      if (module.interfaces.length === 0) {
        return;
      }
      // 文件头部
      let text = `
        /**
         * ${module.name}
         * @description 自动生成接口文件 ${module.description}
         */
        import request from "@/api/request";
      `;

      // 接口请求function
      text += module.interfaces.map(item => this.insertApi(item)).join("\n");

      // 路径
      let path = `${this.API_PATH}${this.group.name ? `/${this.group.name}` : ""}`;
      let fileName = path + "/" + module.name + ".ts";
      fs.mkdirSync(path, { recursive: true });
      // 写入文件
      fs.writeFileSync(fileName, text);
      // 使用prettier格式代码
      child_process.exec(`npx prettier ${fileName} --write`, function(error, stdout, stderr) {
        if (error !== null) {
          console.error("exec error: " + error);
        }
      });
    });
  }
}
// 根据node的http模块进行数据的请求
function get(url: string, options?) {
  return new Promise<any>((resolve, reject) => {
    http
      .get(url, options, res => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let error;
        // 任何 2xx 状态码都表示成功响应，但这里只检查 200。
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n'  Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(`Invalid content-type.\n' Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          // 消费响应数据以释放内存
          res.resume();
          return;
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            console.error(e.message);
            reject(e);
          }
        });
      })
      .on("error", e => {
        reject(e);
        console.error(`Got error: ${e.message}`);
      });
  });
}

let generateApis = new GenerateApis();
generateApis.getAll();
// generateApis.getGroup(
//   "http://10.10.77.129:8080/v2/api-docs?group=%E4%B8%89%E4%B8%AD%E5%BF%83%E7%99%BB%E5%BD%95%E8%AE%A4%E8%AF%81",
// );
// generateApis.getGroup("http://10.10.77.129:8080/v2/api-docs?group=%E5%9F%BA%E7%A1%80%E6%95%B0%E6%8D%AE");

// 接口
type Interface = Method & {
  method: string;
  url: string;
};
// swagger返回的paths内的get等后的内容
interface Method {
  tags: string[];
  summary: string;
  operationId: string;
  consumes: string[];
  produces: string[];
  parameters: any[];
  responses: any;
  deprecated: boolean;
  "x-order": string;
}

// swagger的模块
interface Group {
  name?: string;
  swagger: string;
  info: {
    version: string;
    title: string;
    termsOfService: string;
    contact: {
      name: string;
      url: string;
    };
  };
  host: string;
  basePath: string;
  tags: {
    name: string;
    description: string;
  }[];
  consumes: string[];
  produces: string[];
  paths: Record<string, Record<string, Method>>;
  definitions: any;
}
// 一个文件模块
interface Module {
  name: string;
  description: string;
  interfaces: Interface[];
  lastUrl?: string;
}
