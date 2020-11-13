export LD_LIBRARY_PATH=/Volumes/Learning/NodeJS/hp1_encoder:/Volumes/Learning/NodeJS/hp1_encoder/lib64

pm2 start ecosystem.config.js --env local
pm2 logs
