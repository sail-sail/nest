const SSH2Promise = require("ssh2-promise");
const fs = require("fs/promises");
const { randomUUID } = require("node:crypto");
const ecosystem = require(`${ __dirname }/../../ecosystem.config.js`);
const publish_cnf = require(`${ __dirname }/publish_cnf.js`);

const projectName = ecosystem.apps[0].name;
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
    console.error(err.message);
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
    const cmd = `rm -rf ${ publishPath }/docs`;
    data = await ssh.exec(cmd);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    const cmd = `rm -rf ${ publishPath }/pc`;
    data = await ssh.exec(cmd);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    const cmd = `pm2 stop ${ projectName }`;
    data = await ssh.exec(cmd);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    const cmd = `rm -rf ${ publishPath }/deno`;
    data = await ssh.exec(cmd);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    const cmd = `mkdir ${ publishPath }`;
    console.log(cmd);
    await sftp.mkdir(`${ publishPath }`);
  } catch (err) {
    console.log(err);
  }
  
  try {
    const cmd = `mv -f ${ publishPathTmp }/* ${ publishPath }/ && rm ${ publishPathTmp }`;
    console.log(cmd);
    data = await ssh.exec(cmd);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
  
  {
    const cmd = `chmod -R 755 ${ publishPath }/deno/${ projectName }`;
    console.log(cmd);
    await ssh.exec(cmd);
  }
  
  {
    const cmd = `cd ${ publishPath }/deno/ && pm2 start`;
    console.log(cmd);
    data = await ssh.exec(cmd);
  }
  
  if (data) {
    console.log(data);
  }
  
  await ssh.close();
})();
