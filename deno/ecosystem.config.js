module.exports = {
  apps: [{
    name: "eams4{env}",
    script: "./eams4{env}",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
