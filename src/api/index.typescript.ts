/**
 * @Author: wenlin
 * @Description: 根据接口文档自动生成api。生成的是ts有详细类型的，但由于后台接口不规范，使用index版本生成简版
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import fs from 'fs';
import path from 'path';
import http from 'http';
import child_process from 'child_process';

// TODO: 加载指定tag
// TODO: 一个接口存在多个tag中的时候
// TODO: 中文转英文
// TODO: 部分更新的时候的处理  -暂无处理方案 - -
// TODO: 入参注释在function里面的时候的注释

let API_PATH = path.resolve(__dirname, "./modules_generate"); // 接口保存的路径
let url = "http://10.10.77.129:8080"; // 接口的地址
let simple = true; // 是否简易模式，只加载接口。不出来定义类型

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

// 判断目录是否存在
const isExist = (lastPath = "") => {
  const privatePath = `${lastPath ? lastPath : API_PATH}`;
  const stat = fs.existsSync(privatePath);
  if (!stat) {
    fs.mkdirSync(privatePath);
  }
};

export default class GenerateApis {
  // 当前处理的group
  private group: Group;
  // 当前文件模块已生成的接口的集合
  private interfaces: Record<string, any> = {};
  // 当前接口往下递归时候的tree结构
  private interfacesNodes: string[] = [];
  // 当前文件模块需要公共的接口名
  private interfacesNames: string[] = [];
  // 获取所有接口组
  public async getAll() {
    // 获取文档模块列表
    let data = await get(`${url}/swagger-resources`);
    isExist();
    data.forEach(async group => {
      await this.getGroup(`${url}${group.url}`, group.name);
    });
    // fs.mkdirSync('./modules');
  }
  // 获取某个组的数据
  public async getGroup(url: string, name?: string) {
    isExist();
    try {
      // 解析url 获得
      this.group = await get(url);
      this.interfaces = {};
      console.log(url, 2);
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
        interfaces: [],
      });

      const urls = Object.keys(paths); // 获取url路径
      // 将一个模块接口.归类到自己对应的module
      urls.forEach(url => {
        // get post等
        let methods = Object.keys(paths[url]);
        let interfaces: Interface[] = methods.map(method => ({
          ...paths[url][method],
          method: method.toLocaleLowerCase(),
          url,
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
  // 数据类型
  private dataType(key, propertiesItem?: any) {
    const type = {
      string: "string",
      integer: "number",
      int: "number",
      long: "string",
      Array: "array",
      file: "Blob",
      boolean: "boolean",
    };
    // 处理嵌套的数据
    if (key === "array" && propertiesItem) {
      return (
        (propertiesItem.items.originalRef
          ? this.getDefinitionsInterface(this.group.definitions[propertiesItem.items.originalRef])
          : propertiesItem.items.type
          ? this.dataType(propertiesItem.items.type)
          : "any") + " []"
      );
    } else if (propertiesItem && propertiesItem.originalRef) {
      return this.getDefinitionsInterface(this.group.definitions[propertiesItem.originalRef]);
    }
    return type[key] ? type[key] : "any";
  }
  // 根据 definitions 里面的对象.进行生成一个接口定义
  private getDefinitionsInterface(data: any, interfaceName?: string) {
    let str = `${interfaceName ? `type ${interfaceName} =` : ""} any`;
    if (data.title && this.interfacesNodes.includes(data.title)) {
      return "DeepCommon" + data.title;
    }
    data.title && this.interfacesNodes.push(data.title);

    if (data.type === "object" && data.properties) {
      let keys = Object.keys(data.properties);
      let params_ = keys.map(key => {
        data.properties[key]["key"] = key;
        return data.properties[key];
      });
      if (params_) {
        str = `{${params_
          .map(item => {
            let index = this.interfacesNodes.findIndex(item => item === data.title);
            if (index > -1) {
              this.interfacesNodes = this.interfacesNodes.slice(0, index + 1);
            }
            return (
              `/** ${this.formatText(item.description)} */` +
              "\n" +
              `${item.key}${data.required && data.required.includes(item.key) ? "" : "?"} : ${this.dataType(
                item.type,
                item,
              )};`
            );
          })
          .join("\n")}
          }`;
        if (data.title) {
          this.interfaces[data.title] = str;
        }
        str = `${interfaceName ? `interface ${interfaceName} ` : ""}` + str;
      }
    }
    return str;
  }

  // 入参参数模板
  private interfaceParamsTpl(api: Interface, interfaceName: string) {
    console.log(api.url);
    let params_ = [];
    if (api.method === "get" || api.method === "delete") {
      params_ = (api.parameters || []).filter(item => item.in === "query");
      if (params_.length === 0) {
        return "";
      } else {
        return `interface ${interfaceName} {
          ${params_
            .map(
              item =>
                ` /** ${this.formatText(item.description)} */
                  "${item.name}"${item.required ? "" : "?"}: ${this.dataType(item.type)};`,
            )
            .join("\n")}
        }`;
      }
    } else {
      // body的数据,理论上应该只有一个
      let bodys = (api.parameters || []).filter(item => item.in === "body");
      return (
        bodys.map(item =>
          item.schema.originalRef
            ? this.getDefinitionsInterface(this.group.definitions[item.schema.originalRef], interfaceName)
            : item.schema.type
            ? `interface ${interfaceName} {
               /** ${this.formatText(item.description)} */
                  "${item.name}"${item.required ? "" : "?"}: ${this.dataType(item.schema.type, item.schema)};
              }`
            : "",
        )[0] || ""
      );
    }
  }

  // 将某个接口写入模板
  private tplInsertApi(api: Interface) {
    let url = api.url;
    let params: string[] = [];
    // 递归参数对象的时候。记录每一层级
    this.interfacesNodes = [];
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
        ...(api.parameters || []).filter(item => item.in === "query").map(item => item.name + ": string | number"),
      );
    }
    // 入参作为对象传入
    let interfaceParams = this.interfaceParamsTpl(api, "I" + fnName);
    if (interfaceParams) {
      params.push(!simple ? `params?: ${"I" + fnName}` : "params?: any");
    }
    // 出参的处理
    let resInterface = "";
    let resName = "Res" + fnName;
    if (api.responses["200"].schema && api.responses["200"].schema.originalRef) {
      // console.log(api.responses["200"].schema.originalRef, 1);
      let data = this.group.definitions[api.responses["200"].schema.originalRef];
      // .properties.data;
      if (data) {
        if (data.type === "array") {
          resInterface = this.getDefinitionsInterface(data, resName);
          resName += "[]";
        } else if (data.type === "object") {
          resInterface = this.getDefinitionsInterface(data, resName);
        } else {
          resName = this.dataType(data.type);
        }
      }
    }
    // 生成请求的function字符串
    let apiStr = `
      ${!simple ? interfaceParams : ""}
      ${!simple ? resInterface : ""}
      /**
       * @description ${this.formatText(api.summary)}
       */
      export function ${fnName}(${params.join(", ")}) {
        return request.${api.method}${!simple && resInterface ? `<${resName}>` : ""}
        (\`${url}\`${interfaceParams ? ", params" : ""});
      }`;

    let regReplace = /DeepCommon.*?(?=[[\s])/g; // /DeepCommon(.*?)[[\s]/;
    if (apiStr.match(regReplace)) {
      this.interfacesNames.push(...apiStr.match(regReplace));
    }

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
      // 公共深拷贝的接口定义
      if (!simple && this.interfacesNames.length) {
        let names = new Set(this.interfacesNames);
        names.forEach(name => {
          text = `interface ${name} ` + this.interfaces[name.replace("DeepCommon", "")] + text + "\n";
        });
      }
      this.interfacesNames = [];
      // 接口请求function
      text += module.interfaces.map(item => this.tplInsertApi(item)).join("\n");

      // 路径
      let path = `${API_PATH}${this.group.name ? `/${this.group.name}` : ""}`;
      let fileName = path + "/" + module.name + ".ts";
      isExist(path);
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
            console.error(e);
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
