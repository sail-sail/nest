const SSH2Promise = require("ssh2-promise");
const fs = require("fs/promises");
const { randomUUID } = require("node:crypto");
const ecosystem = require(`${ __dirname }/../../ecosystem.config.js`);
const publish_cnf = require(`${ __dirname }/publish_cnf.js`);

const { Command } = require("commander");

const envArgs = process.argv;
const program = new Command();
program
  .option('--env [value]', '执行环境dev, test, prod')
  .parse(envArgs);

const options = program.opts();
const env = options.env || "prod";

const projectName = ecosystem.apps[0].name.replaceAll("{env}", env);
const publishBase = publish_cnf[projectName].publishBase;

const sshConfig = {
  host: publish_cnf[projectName].host,
  username: publish_cnf[projectName].username,
  password: publish_cnf[projectName].password,
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
        await sftp.fastPut(`${ buildPath }/${ dir }/${ file }`, `${ publishPathTmp }/${ dir }/${ file }`);
      }
    }
  };
  await treeDir("");
  
  try {
    let cmd = "";
    cmd += `rm -rf ${ publishPath }/docs`;
    cmd += ` ; pm2 stop ${ projectName }`;
    cmd += ` ; rm -rf ${ publishPath }/pc`
    cmd += ` ; rm -rf ${ publishPath }/deno`
    cmd += ` ; rm -rf ${ publishPath }/uni`
    cmd += ` ; mkdir -p ${ publishPath }`;
    cmd += ` ; mv -f ${ publishPathTmp }/* ${ publishPath }/`;
    cmd += ` ; rm -rf ${ publishPathTmp }`;
    cmd += ` ; chmod -R 755 ${ publishPath }/deno/${ projectName }`;
    cmd += ` ; cd ${ publishPath }/deno/ && pm2 start`;
    data = await ssh.exec(cmd);
  } catch (err) {
    console.error(err);
  }
  
  if (data) {
    console.log(data);
  }
  
  await ssh.close();
})();
