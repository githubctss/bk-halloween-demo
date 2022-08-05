#!/bin/bash
cd ../

pm2 stop all
rm -rf dist
yarn nx reset
yarn web:build
pm2 reload ecosystem.config.js