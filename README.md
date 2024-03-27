```
git config --global core.autocrlf false

185.199.108.133 raw.githubusercontent.com
```

1. 安装Mysql数据库
```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS nest CHARSET utf8mb4;
-- 创建用户
create user 'nest'@'%' identified by 'umbdflXHI0osat2v';
-- 设置用户密码不过期
ALTER USER 'nest'@'%' IDENTIFIED BY 'umbdflXHI0osat2v' PASSWORD EXPIRE NEVER;
-- 修改密码策略
ALTER USER 'nest'@'%' IDENTIFIED WITH mysql_native_password BY 'umbdflXHI0osat2v';
-- 给用户授权
grant drop,index,select,insert,update,delete,execute,alter,create,references,lock tables on nest.* to 'nest'@'%';
-- 刷新权限
flush privileges;

SHOW GLOBAL VARIABLES LIKE 'innodb_buffer_pool_size';

SET GLOBAL innodb_buffer_pool_size = 1073741824;
```

2. linux检查端口是否被占用
```
netstat -tunlp |grep 1883
```

3. 安装nginx
```
yum install nginx -y
设置开机自动启动: systemctl enable nginx
启动服务: systemctl start nginx
重新读取配置文件: nginx -s reload
```

4. CentOS压缩文件夹
```
tar zcfv /data/nest.tar.gz /data/nest
```

5. CentOS解压文件夹
```
tar -xzvf /data/software/nest.tar.gz /data/
```

6. CentOS通过yum安装nodejs
```
curl --silent --location https://rpm.nodesource.com/setup_16.x | bash -
yum -y install nodejs
node -v
yum install gcc-c++ make

给文件加入配置 /root/.npmrc
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

npm config list
npm i -g pm2
npm i -g pnpm

pm2 配置日志
pm2 install pm2-logrotate
通过 pm2 conf pm2-logratate 可以查看日志详细的配置
```

7. Ubuntu 通过apt安装nodejs
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt -y install nodejs
node -v
apt-get install build-essential

给文件加入配置 /root/.npmrc
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

npm config list
npm i -g pm2
npm i -g pnpm
```

8. Ubuntu 通过apt安装nginx
```
apt-get -y install nginx

查看nginx服务:
service nginx status

修改nginx配置文件:
/etc/nginx/nginx.conf

重启nginx:
service nginx restart
```

9. Ubuntu 查看端口是否开放
```
lsof -i:50000
```

```
CentOS8安装mysql5.7
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.36-1.el7.x86_64.rpm-bundle.tar
tar -xvf mysql-5.7.36-1.el7.x86_64.rpm-bundle.tar
yum install perl
rpm -ivh mysql-community-common-5.7.36-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.36-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.36-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.36-1.el7.x86_64.rpm

mkdir /data/mysql
chown mysql /data/mysql

/etc/my.conf 配置文件:
 [mysqld]
 port=3389
 innodb_buffer_pool_size = 512M
 datadir=/data/mysql
 socket=/data/mysql/mysql.sock
 symbolic-links=0
 log-error=/data/mysql/mysqld.log
 pid-file=/data/mysql/mysqld.pid

systemctl start mysqld

mysql修改密码(或者去/data/mysql下的日志文件找临时密码, 第一次启动mysql会生成临时密码):
systemctl stop mysqld
mysqld --defaults-file="/etc/my.cnf" --console --skip-grant-tables --user=mysql
打开另外一个shell窗口
mysql -hlocalhost -uroot -S/data/mysql/mysql.sock -p
flush privileges;
ALTER USER 'root'@'localhost' IDENTIFIED BY '[密码]';
update mysql.user set host= '%' where user='root';
flush privileges;
exit
杀掉mysql进程然后启动服务:
systemctl start mysqld

mysql -hlocalhost -uroot -S/data/mysql/mysql.sock -p
select version();
show variables like 'datadir';
```

```
mysql导出数据:
mysqldump --defaults-file="/etc/my.cnf" --user=nest -p --host=localhost --protocol=tcp --port=3306 --default-character-set=utf8 --skip-triggers "nest" > nest.sql
```

10. PM2设置开机自启动
```
pm2 startup
pm2 save

centos7/8:
systemctl restart pm2-root

ubuntu:
service pm2-root restart

pm2 ls
```

11. 设置CMD窗口为UTF-8编码
```
chcp 65001
新建系统环境变量 LESSCHARSET 并赋值为utf-8

git diff --full-index codegen/project/* > test.diff
git apply test.diff --ignore-space-change
```

12. npm各种命令
```
生成密码:
npm run pwd [密码]

初始化数据库:
npm run initdb

生成uuid:
npm run uuid

生成指定表的代码:
npm run codegen -- -t usr
生成全部表的代码:
npm run codegen

应用生成的代码:
npm run codeapply
```

#### 发布部署
```
自动编译和发布前端:
npm run build:pc

自动编译和发布后端:
npm run build:nest

自动编译和发布前后端:
npm run build
```

#### CentOS8 安装redis
```
1. 安装
yum install epel-release
yum install redis

2. 启动
systemctl start redis

3. 设置开机自启
systemctl enable redis

4. 修改配置文件
vi /etc/redis.conf
```
