module.exports = {
  apps: [{
    name: "rust4{env}",
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
