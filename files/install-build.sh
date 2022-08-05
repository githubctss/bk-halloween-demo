#!/bin/bash
cd ../

pm2 stop all
rm -rf node_modules
rm -rf dist
yarn install
yarn nx reset
yarn web:build
pm2 reload ecosystem.config.js