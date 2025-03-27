const SSH2Promise = require("ssh2-promise");
const fs = require("fs/promises");
const { randomUUID } = require("node:crypto");
const ecosystem = require(`${ __dirname }/../../../ecosystem.config.js`);
const publish_cnf = require(`${ __dirname }/publish_cnf.js`);

const { Command } = require("commander");

const envArgs = process.argv;
const program = new Command();
program
  .option('--env [value]', '执行环境dev, test, prod')
  .option('--command [value]', '执行命令 deno,nuxt,docs,pc,uni')
  .parse(envArgs);

const options = program.opts();
const env = options.env;

if (!env) {
  console.error("请指定环境参数 --env dev, test, prod");
  process.exit(1);
}

const commands = (options.command || "").split(",").filter((v) => v);

if (commands.length > 0) {
  console.log("publish-commands: ", commands);
}

const projectName = ecosystem.apps[0].name.replaceAll("{env}", env);
const publishBase = publish_cnf[projectName]?.publishBase;

if (!publishBase) {
  console.error(`错误: 未找到项目 ${ projectName } 的发布配置`);
  process.exit(1);
}

const sshConfig = {
  host: publish_cnf[projectName].host,
  username: publish_cnf[projectName].username,
  password: publish_cnf[projectName].password,
};

console.log({ ...sshConfig, password: "" });

const buildPath = `${ __dirname }/../../../../build/`;
const publishPath = `${ publishBase }/${ projectName }/`;
const uuid = randomUUID();
const publishPathTmp = `${ publishBase }/${ projectName }_tmp_${ uuid }/`;

console.log(publishPath);

(async function() {
  const ssh = new SSH2Promise(sshConfig);
  await ssh.connect();
  const sftp = ssh.sftp();
  
  let data;
  
  try {
    const cmd = `mkdir -p ${ publishPathTmp }`;
    console.log(cmd);
    data = await ssh.exec(cmd);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  
  let num = 0;
  console.log("已上传文件数: ");
  const treeDir = async function(dir) {
    const files = await fs.readdir(`${ buildPath }/${ dir }`);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stats = await fs.stat(`${ buildPath }/${ dir }/${ file }`);
      if (stats.isDirectory()) {
        try {
          await sftp.mkdir(`${ publishPathTmp }/${ dir }/${ file }`);
        } catch (errTmp) {
          console.error(errTmp.message);
        }
        await treeDir(`/${ dir }/${ file }`);
      } else {
        num++;
        await sftp.fastPut(`${ buildPath }/${ dir }/${ file }`, `${ publishPathTmp }/${ dir }/${ file }`);
        if (num % 20 === 0) {
          console.log(num);
        }
      }
    }
  };
  await treeDir("");
  
  if (commands.length === 0) {
    try {
      let cmd = "";
      cmd += `rm -rf ${ publishPath }/docs`;
      cmd += ` ; pm2 stop ${ projectName }`;
      cmd += ` ; rm -rf ${ publishPath }/pc`
      cmd += ` ; rm -rf ${ publishPath }/rust`
      cmd += ` ; rm -rf ${ publishPath }/uni`
      cmd += ` ; mkdir -p ${ publishPath }`;
      cmd += ` ; mv -f ${ publishPathTmp }/* ${ publishPath }/`;
      cmd += ` ; rmdir ${ publishPathTmp }`;
      cmd += ` ; chmod -R 755 ${ publishPath }/rust/${ ecosystem.apps[0].script.replace("./", "") }`;
      cmd += ` ; cd ${ publishPath }/rust/ && pm2 start`;
      data = await ssh.exec(cmd);
    } catch (err) {
      console.error(err);
    }
    
    if (data) {
      console.log(data);
    }
  }
  
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (cmd === "rust") {
      let cmd = "echo 'rust'";
      cmd += ` ; pm2 stop ${ projectName }`;
      cmd += ` ; rm -rf ${ publishPath }/rust`
      cmd += ` ; mkdir -p ${ publishPath }`;
      cmd += ` ; mv -f ${ publishPathTmp }/* ${ publishPath }/`;
      cmd += ` ; rm -rf ${ publishPathTmp }`;
      cmd += ` ; chmod -R 755 ${ publishPath }/rust/${ ecosystem.apps[0].name.replaceAll("4{env}", "") }`;
      cmd += ` ; cd ${ publishPath }/rust/ && pm2 start`;
      let data;
      try {
        data = await ssh.exec(cmd);
      } catch (err) {
        console.error(err);
      }
      if (data) {
        console.log(data);
      }
      continue;
    }
    if (cmd === "docs") {
      let cmd = "echo 'docs'";
      cmd += ` ; rm -rf ${ publishPath }/docs`;
      cmd += ` ; mv -f ${ publishPathTmp }/* ${ publishPath }/`;
      cmd += ` ; rm -rf ${ publishPathTmp }`;
      let data;
      try {
        data = await ssh.exec(cmd);
      } catch (err) {
        console.error(err);
      }
      if (data) {
        console.log(data);
      }
      continue;
    }
    if (cmd === "pc") {
      let cmd = "echo 'pc'";
      cmd += ` ; rm -rf ${ publishPath }/pc`;
      cmd += ` ; mv -f ${ publishPathTmp }/* ${ publishPath }/`;
      cmd += ` ; rm -rf ${ publishPathTmp }`;
      let data;
      try {
        data = await ssh.exec(cmd);
      } catch (err) {
        console.error(err);
      }
      if (data) {
        console.log(data);
      }
      continue;
    }
    if (cmd === "uni") {
      let cmd = "echo 'uni'";
      cmd += ` ; rm -rf ${ publishPath }/uni`;
      cmd += ` ; mv -f ${ publishPathTmp }/* ${ publishPath }/`;
      cmd += ` ; rm -rf ${ publishPathTmp }`;
      let data;
      try {
        data = await ssh.exec(cmd);
      } catch (err) {
        console.error(err);
      }
      if (data) {
        console.log(data);
      }
      continue;
    }
    console.error(`未知命令: ${ cmd }`);
  }
  
  await ssh.close();
  
  console.log("");
  console.log("发布完成");
})();
