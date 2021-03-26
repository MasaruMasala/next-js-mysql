module.exports = {
  apps: [
    {
      name: "app",
      script: "./node_modules/next/dist/bin/next",
      args: ["-p", "3000"],
      watch: false,
      env: {},
      env_production: {
        args: ["start", "-p", "3000"],
      },
    },
  ],
};
