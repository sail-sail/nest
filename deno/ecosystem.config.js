module.exports = {
  apps: [{
    name: "deno",
    script: "./deno",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
