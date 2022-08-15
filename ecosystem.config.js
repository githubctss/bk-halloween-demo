module.exports = {
  apps : [
    {
      name: "webview",
      script: 'yarn install && yarn start',
      cwd: 'dist/apps/web/.next',
      watch: '.',
      env: {
        PORT: 3005
      }
    },
  ],

  deploy : {
    production : {
      user : 'admin',
      host : 'ec2-52-53-176-156.us-west-1.compute.amazonaws.com',
      key  : 'files/ec2-bk-halloween.pem',
      ref  : 'origin/main',
      repo : 'https://github.com/githubctss/bk-halloween-demo.git',
      path : '/home/admin/bk-webview',
      'pre-deploy-local': '',
      'post-deploy' : 'cd files && ./install-build.sh',
      'pre-setup': ''
    },
    prodbuild : {
      user : 'admin',
      host : 'ec2-52-53-176-156.us-west-1.compute.amazonaws.com',
      key  : 'files/ec2-bk-halloween.pem',
      ref  : 'origin/main',
      repo : 'https://github.com/githubctss/bk-halloween-demo.git',
      path : '/home/admin/bk-webview',
      'pre-deploy-local': '',
      'post-deploy' : 'cd files && ./build.sh',
      'pre-setup': ''
    }
  }
};