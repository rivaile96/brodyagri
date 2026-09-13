module.exports = {
  apps: [
    {
      name: 'brodyagri',
      cwd: '/opt/brody-workspace/brodyagri/apps/tanam',
      script: '/opt/brody-workspace/brodyagri/node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'agriradar',
      cwd: '/opt/brody-workspace/brodyagri/apps/mayur',
      script: '/opt/brody-workspace/brodyagri/node_modules/next/dist/bin/next',
      args: 'start -p 3003',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    }
  ]
};
