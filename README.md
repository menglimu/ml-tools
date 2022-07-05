### 通用工具集

1. ##### ml-version

   **生成当前打包的版本信息（分支、提交、打包时间、远端地址）。生成一个HTML文件，默认生成文件为dist。**

   入参：dir 生成的文件目录，默认为dist，react项目传入build

2. ##### ml-api

   **根据后端的swagger文档，生成相关接口。**

   使用限制：

   1. 需提供给@/api/request方法，默认导出实现get,post,delete,put方法
   2. 由于在后端复制相同方法名，会产生swagger名冲突而进行重命名方法的原因，js版本不建议使用，**请在ts项目中使用**

   入参：

   ​	url  swagger文档的地址，如接口文档地址为http://www.aaa.com/bbb/doc.html 需传入http://www.aaa.com/bbb

   ​	dir 生成文件的目录，默认为 src/api/modules_generate

3. ##### ml-clone

   从现有模板中进行项目克隆，使用多个远端的方式，方便一些更改就行全面的同步

4. 

   

   