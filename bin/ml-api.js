'use strict';

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var http = require('http');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var child_process__namespace = /*#__PURE__*/_interopNamespace(child_process);
var http__namespace = /*#__PURE__*/_interopNamespace(http);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// 根据node的http模块进行数据的请求
function get(url, options) {
    return new Promise((resolve, reject) => {
        http__namespace
            .get(url, options, res => {
            const { statusCode } = res;
            const contentType = res.headers["content-type"];
            let error;
            // 任何 2xx 状态码都表示成功响应，但这里只检查 200。
            if (statusCode !== 200) {
                error = new Error(`Request Failed.\n'  Status Code: ${statusCode}`);
            }
            else if (!/^application\/json/.test(contentType)) {
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
                }
                catch (e) {
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

/**
 * @Author: wenlin
 * @Description: 根据接口文档自动生成api
 */
const __dirname$1 = path__namespace.resolve();
// TODO: 加载指定tag
// TODO: 一个接口存在多个tag中的时候
// TODO: 部分更新的时候的处理  -暂无处理方案 - -
class GenerateApis {
    constructor() {
        this.url = "http://10.10.77.129:8080"; // 接口的地址
        this.API_PATH = path__namespace.resolve(__dirname$1, "./modules_generate"); // 接口保存的路径
    }
    // 获取所有接口组
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取文档模块列表
            let data = yield get(`${this.url}/swagger-resources`);
            data.forEach((group) => __awaiter(this, void 0, void 0, function* () {
                yield this.getGroup(`${this.url}${group.url}`, group.name);
            }));
            // fs.mkdirSync('./modules');
        });
    }
    // 获取某个组的数据
    getGroup(url, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 解析url 获得
                this.group = yield get(url);
                console.log(url, 1, "模块");
                this.group.name = name; // || (/group=(.*)/.test(url) && decodeURI(url.match(/group=(.*)/)[1]));
                let { tags, paths } = this.group;
                if (!paths || !tags) {
                    return;
                }
                // 一个module为一个文件
                let modules = tags.map((tag) => (Object.assign(Object.assign({}, tag), { interfaces: [] })));
                // 找不到tag的接口放这里面
                modules.push({
                    name: "other",
                    description: "找不到的模块的接口",
                    interfaces: [],
                });
                const urls = Object.keys(paths); // 获取url路径
                // 将一个模块接口.归类到自己对应的module
                urls.forEach((url) => {
                    // get post等
                    let methods = Object.keys(paths[url]);
                    let interfaces = methods.map((method) => (Object.assign(Object.assign({}, paths[url][method]), { method: method.toLocaleLowerCase(), url })));
                    interfaces.forEach((item) => {
                        let module = modules.find((module) => item.tags.includes(module.name)) ||
                            modules.find((module) => module.name === "other");
                        module.interfaces.push(item);
                        module.lastUrl = url;
                    });
                });
                // 写入模块文件
                this.writeModules(modules);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    // 将某个接口写入模板
    insertApi(api) {
        let url = api.url;
        console.log(url);
        let params = [];
        // 有{id}这样的接口查询的时候
        let reg = /{(.*?)}/g;
        if (reg.test(url)) {
            url = url.replace(reg, (id) => `$${id}`);
            // 讲参数拼接进入接口参数
            params = url.match(reg).map((str) => str.replace(/[{}]/g, "") + ": string | number");
        }
        let fnName = api.operationId;
        // post 里面有query时的处理
        if (api.method === "post" || api.method === "put") {
            params.concat(...(api.parameters || []).filter((item) => item.in === "query").map((item) => item.name + ": string | number"));
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
    writeModules(modules) {
        modules.forEach((module) => {
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
            text += module.interfaces.map((item) => this.insertApi(item)).join("\n");
            // 路径
            let path = `${this.API_PATH}${this.group.name ? `/${this.group.name}` : ""}`;
            let fileName = path + "/" + module.name + ".ts";
            fs__namespace.mkdirSync(path, { recursive: true });
            // 写入文件
            fs__namespace.writeFileSync(fileName, text);
            // 使用prettier格式代码
            child_process__namespace.exec(`npx prettier ${fileName} --write`, function (error, stdout, stderr) {
                if (error !== null) {
                    console.error("exec error: " + error);
                }
            });
        });
    }
    // 格式注释文本
    formatText(text) {
        // 文本说明中的 */会影响注释。替换掉
        return text ? String(text).replace(/\*\//g, "*\\") : "";
    }
}
let generateApis = new GenerateApis();
generateApis.getAll();
// generateApis.getGroup(
//   "http://10.10.77.129:8080/v2/api-docs?group=%E4%B8%89%E4%B8%AD%E5%BF%83%E7%99%BB%E5%BD%95%E8%AE%A4%E8%AF%81",
// );
// generateApis.getGroup("http://10.10.77.129:8080/v2/api-docs?group=%E5%9F%BA%E7%A1%80%E6%95%B0%E6%8D%AE");
