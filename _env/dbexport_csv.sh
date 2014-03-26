#!/bin/bash

mongoexport \
	-h ${MONGO_HOST}  \
	-d ${MONGO_DBNAME} \
	-c $1 \
	-u  ${MONGO_USER} \
	-p  ${MONGO_PWD} \
	-o $2 \
	--csv \
	-f $3
