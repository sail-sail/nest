module.exports = {
  apps: [{
    name: "rust4xh4hrm",
    script: "./server",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
