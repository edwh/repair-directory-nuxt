// Start with pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'Repair Directory',
      exec_mode: 'cluster',
      instances: 'max',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
  ],
}
