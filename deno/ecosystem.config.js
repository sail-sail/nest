module.exports = {
  apps: [{
    name: "nest4{env}",
    script: "./nest4{env}",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
