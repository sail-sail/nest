module.exports = {
  apps: [{
    name: "nest",
    script: "./nest",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
