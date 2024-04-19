module.exports = {
  apps: [{
    name: "nest4{env}4nuxt",
    port: "{NUXT_PORT}",
    script: "./server/index.mjs",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
    },
    env_production: {
    },
  }],
};
