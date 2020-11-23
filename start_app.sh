#######################################################################################

## uncomment this section to use for environment production ##

# export LD_LIBRARY_PATH=/home/adnapp/hp1_encoder:/home/adnapp/hp1_encoder/lib64;
# pm2 start ecosystem.config.js --env production
# pm2 logs

## uncomment this section to use for environment production ##
#######################################################################################

#######################################################################################

## uncomment this section to use for environment staging ##

# export LD_LIBRARY_PATH=/home/serveradm/hp1_encoder:/home/serveradm/hp1_encoder/lib64;
# pm2 start ecosystem.config.js --env staging
# pm2 logs

## uncomment this section to use for environment staging ##
#######################################################################################

#######################################################################################
## uncomment this section to use for environment development ##

export LD_LIBRARY_PATH=/home/serveradm/hp1_encoder:/home/serveradm/hp1_encoder/lib64
pm2 start ecosystem.config.js --env development
pm2 logs

## uncomment this section to use for environment development ##
#######################################################################################
