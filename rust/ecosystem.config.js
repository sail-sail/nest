module.exports = {
  apps: [{
    name: "rust",
    script: "./rust",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
