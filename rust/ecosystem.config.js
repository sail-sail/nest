module.exports = {
  apps: [{
    name: "server",
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
