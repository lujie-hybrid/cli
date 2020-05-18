#!/usr/bin/env node
const cm = require("commander");
const inquirer = require("inquirer");
const figlet = require("figlet");
const chalk = require("chalk");
const ora = require("ora");
const version = require("./package.json").version;
const download = require("download-git-repo");
const repo = "lujie-hybrid/template";
const path = require("path");
const shell = require("shelljs");
const fs = require("fs");

cm.version(version, "-v, --version");
cm.command("init <name>").action(name => {
  figlet.text(
    "ztkj",
    {
      font: "Blocks"
    },
    (err, data) => {
      // 构造函数有两个参数
      if (err) return;
      console.log(data);
      console.log(chalk.blueBright.bold(`\n脚手架[ljinitcli] v${version}\n`));
      console.log(
        chalk.blue("--------------------------开始--------------------------\n")
      );
      inquirer
        .prompt([
          {
            type: "list",
            name: "item",
            message: "请选择要初始化的项目(使用方向键选择)：",
            choices: [
              {
                name: "中天项目1",
                value: 1
              },
              {
                name: "中天项目2",
                value: 2
              }
            ]
          },
          {
            type: "checkbox",
            name: "chk",
            message: "请选择项目需要的条件(按空格选择，上下方向键移动)：",
            choices: [
              {
                name: "条件1",
                value: 1
              },
              {
                name: "条件2",
                value: 2
              },
              {
                name: "条件3",
                value: 3
              },
              {
                name: "条件4",
                value: 4
              }
            ]
          }
        ])
        .then(answers => {
          console.log(answers);
          if (
            fs.existsSync(name) &&
            fs.statSync(path.resolve(__dirname, name)).isDirectory()
          ) {
            console.log("文件夹已存在");
            process.exit(1);
          }
          const spinner = ora(chalk.blueBright("\n开始下载项目...\n"));
          spinner.start();
          download(`github:${repo}#master`, name, err => {
            if (err) {
              console.log(err);
              spinner.text = chalk.redBright("下载失败");
              spinner.fail();
              return;
            }
            spinner.text = chalk.greenBright("下载成功");
            spinner.succeed();
            shell.cd(name);
            let installCode = "npm i";
            if (shell.which("cnpm")) {
              installCode = "cnpm i";
              console.log(
                chalk.blueBright("\n------开始安装依赖 cnpm install------\n")
              );
            } else {
              console.log(
                chalk.blueBright("\n------开始安装依赖 npm install------\n")
              );
            }
            const pro = ora(chalk.blueBright("安装中...\n"));
            pro.start();
            shell.exec(installCode, code => {
              if (code !== 0) {
                pro.text = chalk.redBright("\n安装失败,请手动安装");
                pro.fail();
                shell.exit(1);
              } else {
                pro.text = chalk.greenBright("\n安装成功");
                pro.succeed();
                console.log(
                  chalk.blueBright(
                    `\n------开始启动项目吧------： \n\n cd ${name} \n npm run serve\n\n`
                  )
                );
              }
            });
          });
        });
    }
  );
});

cm.parse(process.argv);
