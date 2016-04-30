grunt $1
cd dist/web
http-server -p 8082 -c-1

find . -type f|xargs -i touch {}

