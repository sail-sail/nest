module.exports = {
  apps: [{
    name: "nest",
    script: "index.js",
    args: "--enable-source-maps --max_old_space_size=2048",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: "production",
    },
    env_production: {
      NODE_ENV: "production",
    },
  }],
};
