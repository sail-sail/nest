module.exports = {
  apps: [{
    name: "deno4wxwork",
    script: "./deno4wxwork",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
