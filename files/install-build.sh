#!/bin/bash
cd ../

pm2 stop all
rm -rf node_modules
rm -rf dist
yarn install
yarn nx reset
yarn web:build
./node_modules/.bin/next start ./dist/apps/dashboard -p 3005