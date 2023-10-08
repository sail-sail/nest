require("dotenv").config();

module.exports = {
  apps: [{
    name: process.env.server_title,
    script: `./${ process.env.server_title }`,
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
