#!/bin/bash

mongoexport \
	-h ${MONGO_HOST}  \
	-d ${MONGO_DBNAME} \
	-c $1 \
	-u  ${MONGO_USER} \
	-p  ${MONGO_PWD} \
	-o $1.json \

if [ "$2" = "1" ]; then
	perl toRealJSON.pl $1.json
fi
