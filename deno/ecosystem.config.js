module.exports = {
  apps: [{
    name: "wshop",
    script: "./wshop",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
