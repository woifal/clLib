#!/bin/bash

mongoimport \
	-h ${MONGO_HOST}  \
	-d ${MONGO_DBNAME} \
	-c  $1 \
	-u  ${MONGO_USER} \
	-p  ${MONGO_PWD} \
	--file $2  \
	--type csv  \
	--headerline 
