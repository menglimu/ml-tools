import excelPort from "excel-export";
import fs from "fs";
import { staticRoutes } from "./static.js";

// 表头
const cols = [
  { caption: "父菜单", type: "string", width: 20 },
  { caption: "*菜单类型", type: "string", width: 20 },
  { caption: "*菜单名称", type: "string", width: 20 },
  { caption: "链接", type: "string", width: 40 },
  { caption: "排序号", type: "number", width: 20 },
  { caption: "帮助页url", type: "string", width: 20 },
  { caption: "是否以新窗口的方式打开", type: "string", width: 20 },
  { caption: "是否日志", type: "string", width: 20 },
  { caption: "图标", type: "string", width: 20 },
  { caption: "备注", type: "string", width: 20 },
];
function generateExcel(cols: { caption: string; type: string; width?: number }[], rows: string[]) {
  /**
   * 定义一个空对象，来存放表头和内容
   * cols，rows为固定字段，不可修改
   */
  // 调用excelPort的方法，生成最终的数据
  const result = excelPort.execute({
    cols, // 表头
    rows, // 内容
  });
  // 写文件
  fs.writeFile("./routes.xlsx", result, "binary", (err) => {
    if (!err) {
      console.log("生成成功！");
    }else{
      console.error(err);
      
    }
  });
}

const rows = [];
function createRow(routes, deep = 0, parent: any = {}) {
  routes.forEach((item, index) => {
    const row = [
      parent.text || "",
      ["顶级菜单", "节点", "叶子", "按钮"][!isNaN(item.nodeType) ? item.nodeType : deep > 2 ? 2 : deep],
      item.text || "",
      item.url || "",
      isNaN(item.orderNo) ? Number(++index * 10) : item.orderNo,
      item.helpUrl || "",
      // item.expanded ? "是" : "否",
      "否",
      item.logFlag ? "是" : "否",
      item.icon || "",
      item.remark || "",
    ];
    rows.push(row);
    if (item.children) {
      createRow(item.children, deep+1, item);
    }
  });
}

createRow(staticRoutes);
generateExcel(cols, rows);
