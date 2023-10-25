module.exports = {
  apps: [{
    name: "rust4wxwork",
    script: "./rust4wxwork",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
