module.exports = {
  apps: [{
    name: "deno4wxwork{env}",
    script: "./deno4wxwork{env}",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
