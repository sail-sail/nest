const SSH2Promise = require("ssh2-promise");
const fs = require("fs/promises");
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

(async function() {
  const ssh = new SSH2Promise(sshConfig);
  await ssh.connect();
  const sftp = ssh.sftp();
  
  let data;
  
  try {
    await fs.rename(`${ buildPath }/deno/${ projectName }`, `${ buildPath }/deno/${ projectName }2`);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    data = await ssh.exec(`rm -rf ${ publishPath }/docs`);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    data = await ssh.exec(`rm -rf ${ publishPath }/pc`);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    data = await ssh.exec(`pm2 stop ${ projectName }`);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    data = await ssh.exec(`rm -rf ${ publishPath }/deno`);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
  
  try {
    data = await ssh.exec(`mkdir ${ publishPath }/log`);
    console.log(data);
  // deno-lint-ignore no-empty
  } catch (_err) { }
  
  const treeDir = async function(dir) {
    const files = await fs.readdir(`${ buildPath }/${ dir }`);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stats = await fs.stat(`${ buildPath }/${ dir }/${ file }`);
      if (stats.isDirectory()) {
        try {
          await sftp.mkdir(`${ publishPath }/${ dir }/${ file }`);
        } catch (errTmp) {
          console.error(errTmp.message);
        }
        await treeDir(`/${ dir }/${ file }`);
      } else {
        await sftp.fastPut(`${ buildPath }/${ dir }/${ file }`, `${ publishPath }/${ dir }/${ file }`);
      }
    }
  };
  await treeDir("");
  
  await sftp.rename(`${ publishPath }/deno/${ projectName }2`, `${ publishPath }/deno/${ projectName }`);
  
  await ssh.exec(`chmod -R 755 ${ publishPath }/deno/${ projectName }`);
  
  data = await ssh.exec(`cd ${ publishPath }/deno/ && pm2 start`);
  console.log(data);
  
  data = await ssh.exec(`pm2 ls`);
  console.log(data);
  
  await ssh.close();
})();
