module.exports = {
  apps : [
    {
      name: "webview",
      script: 'yarn install && yarn start',
      cwd: 'dist/apps/web/',
      watch: '.',
      env: {
        PORT: 3005
      }
    },
  ],

  deploy : {
    production : {
      user : 'admin',
      host : 'ec2-54-183-78-200.us-west-1.compute.amazonaws.com',
      key  : 'files/ec2-bk-halloween.pem',
      ref  : 'origin/main',
      repo : 'https://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@github.com/Unicorns-and-Unicorns/bk-halloween.git',
      path : '/home/admin/bk-webview',
      'pre-deploy-local': '',
      'post-deploy' : 'cd files && ./install-build.sh',
      'pre-setup': ''
    },
    prodbuild : {
      user : 'admin',
      host : 'ec2-54-183-78-200.us-west-1.compute.amazonaws.com',
      key  : 'files/ec2-bk-halloween.pem',
      ref  : 'origin/main',
      repo : 'https://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@github.com/Unicorns-and-Unicorns/bk-halloween.git',
      path : '/home/admin/bk-webview',
      'pre-deploy-local': '',
      'post-deploy' : 'cd files && ./build.sh',
      'pre-setup': ''
    }
  }
};