import { execSync } from "child_process";
import inquirer from "inquirer";

const qList = [
  {
    type: "list",
    name: "url",
    message: "请选择要使用的模板：",
    choices: [
      { name: "vue-admin-qiankun-main", value: "git@github.com:menglimu/admin_qiankun_main.git" },
      { name: "vue-admin-qiankun-sub", value: "git@github.com:menglimu/admin_qiankun_sub.git" },
      { name: "react-admin-base", value: "git@github.com:menglimu/admin-base-react.git" },
    ],
  },
];
inquirer.prompt(qList).then((res) => {
  execSync(`git remote add -f base ${res.url}
git branch base remotes/base/master`);
});
