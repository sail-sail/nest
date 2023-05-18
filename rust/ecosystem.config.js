module.exports = {
  apps: [{
    name: "rust",
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
