// deno-lint-ignore-file
const SSH2Promise = require("ssh2-promise");
const fs = require("fs/promises");
const path = require("node:path");
const os = require("node:os");
const child_process = require("node:child_process");
const { randomUUID } = require("node:crypto");
const ecosystem = require(`${ __dirname }/../../ecosystem.config.json`);
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

const commands = (options.command || "").split(",").filter((item) => item);

if (commands.length > 0) {
  console.log("publish-commands: ", commands);
}

const projectName = ecosystem.apps[0].name.replaceAll("{env}", env);
console.log("projectName: " + projectName);
console.log("");
if (!publish_cnf[projectName]) {
  console.error(`在 publish_cnf.js 中找不到项目 ${ projectName } 的配置`);
  process.exit(1);
}
const publishBase = publish_cnf[projectName].publishBase;

const sshConfig = {
  host: publish_cnf[projectName].host,
  username: publish_cnf[projectName].username,
  password: publish_cnf[projectName].password,
  identity: publish_cnf[projectName].identity,
};

console.log({ ...sshConfig, password: "" });

const buildPath = `${ __dirname }/../../../build/`;
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
    const cmd = `mkdir ${ publishPathTmp }`;
    console.log(cmd);
    data = await ssh.exec(cmd);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  
  let num = 0;
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
  
  // 本地打包成 tar.gz 后只上传一个压缩包, 服务器端解压, 避免大量小文件逐个 fastPut
  const archiveFile = path.join(os.tmpdir(), `${ projectName }_${ uuid }.tar.gz`);
  const remoteArchive = `${ publishBase }/${ projectName }_${ uuid }.tar.gz`;
  let useArchive = process.env.PUBLISH_NO_TAR !== "1";
  
  if (useArchive) {
    try {
      console.log("本地打包: ", archiveFile);
      // 在 buildPath 下打包 ".", 保证 .env.* 等隐藏文件一并进包
      child_process.execFileSync("tar", ["-czf", archiveFile, "."], { cwd: buildPath });
      const stats = await fs.stat(archiveFile);
      console.log(`打包完成: ${ (stats.size / 1024 / 1024).toFixed(2) } MB`);
    } catch (err) {
      console.error("本地打包失败, 回退到逐文件上传: ", err.message);
      useArchive = false;
    }
  }
  
  if (useArchive) {
    try {
      let percent = 0;
      console.log("上传压缩包: ", remoteArchive);
      await sftp.fastPut(archiveFile, remoteArchive, {
        step: (transferred, chunk, total) => {
          const current = Math.floor(transferred / total * 100);
          if (current >= percent + 10) {
            percent = current;
            console.log(`已上传 ${ current }%`);
          }
        },
      });
      // 解压到临时目录后删除压缩包, 后续步骤仍从 publishPathTmp 取文件, 流程不变
      const cmd = `tar -xzf ${ remoteArchive } -C ${ publishPathTmp } && rm -f ${ remoteArchive }`;
      console.log(cmd);
      data = await ssh.exec(cmd);
      if (data) {
        console.log(data);
      }
      num = Number((await ssh.exec(`find ${ publishPathTmp } -type f | wc -l`) || "").trim()) || 0;
    } catch (err) {
      console.error("压缩包发布失败, 回退到逐文件上传: ", err.message);
      useArchive = false;
      await ssh.exec(`rm -f ${ remoteArchive } ; rm -rf ${ publishPathTmp } ; mkdir -p ${ publishPathTmp }`).catch(() => {});
    } finally {
      await fs.unlink(archiveFile).catch(() => {});
    }
  }
  
  if (!useArchive) {
    console.log("已上传文件数: ");
    await treeDir("");
  }
  console.log(`上传完成, 共 ${ num } 个文件`);
  
  if (commands.length === 0) {
    try {
      let cmd = "";
      cmd += `pm2 stop ${ projectName }`;
      cmd += ` ; rm -rf ${ publishPath }/pc`
      cmd += ` ; rm -rf ${ publishPath }/deno`
      cmd += ` ; rm -rf ${ publishPath }/uni`
      cmd += ` ; mkdir -p ${ publishPath }`;
      cmd += ` ; mv -f ${ publishPathTmp }/* ${ publishPath }/`;
      cmd += ` ; rm -rf ${ publishPathTmp }`;
      cmd += ` ; chmod -R 755 ${ publishPath }/deno/${ projectName }`;
      cmd += ` ; cd ${ publishPath }/deno/ && pm2 start ecosystem.config.json`;
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
    if (cmd === "deno") {
      let cmd = "echo 'deno'";
      cmd += ` ; pm2 stop ${ projectName }`;
      cmd += ` ; rm -rf ${ publishPath }/deno`
      cmd += ` ; mkdir -p ${ publishPath }/deno`;
      cmd += ` ; cp ${ publishPathTmp }/deno/.env.${ env } ${ publishPath }/deno/`;
      cmd += ` ; mv -f ${ publishPathTmp }/deno/* ${ publishPath }/deno/`;
      cmd += ` ; chmod -R 755 ${ publishPath }/deno/${ projectName }`;
      cmd += ` ; cd ${ publishPath }/deno/ && pm2 start ecosystem.config.json`;
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
      cmd += ` ; mkdir -p ${ publishPath }/docs`;
      cmd += ` ; mv -f ${ publishPathTmp }/docs/* ${ publishPath }/docs/`;
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
      cmd += ` ; mkdir -p ${ publishPath }/pc`;
      cmd += ` ; mv -f ${ publishPathTmp }/pc/* ${ publishPath }/pc/`;
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
      cmd += ` ; mkdir -p ${ publishPath }/uni`;
      cmd += ` ; mv -f ${ publishPathTmp }/uni/* ${ publishPath }/uni/`;
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
  
  try {
    const cmd = `rm -rf ${ publishPathTmp }`;
    let data;
    try {
      data = await ssh.exec(cmd);
    } catch (err) {
      console.error(err);
    }
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.error(err);
  }
  
  await ssh.close();
  
  console.log("");
  console.log("发布完成");
})();
