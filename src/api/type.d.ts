// 接口
export type Interface = Method & {
  method: string;
  url: string;
};
// swagger返回的paths内的get等后的内容
export interface Method {
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
export interface Group {
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
export interface Module {
  name: string;
  description: string;
  interfaces: Interface[];
  lastUrl?: string;
}
