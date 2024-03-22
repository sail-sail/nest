module.exports = {
  apps: [{
    name: "rust4wxwork{env}",
    script: "./rust4wxwork{env}",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
