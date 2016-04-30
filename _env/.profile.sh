export PS1="\u@\h \w> "

export HOME=/c/DEV
#export APPDATA=/c/DEV
cd /c/DEV
alias gitstatusAll="git status \`git status -s |grep -v 'dist/' |cut -b4-\`"
alias gitstatus="git status -uno \`git status -s |grep -v 'dist/' |cut -b4-\`"
alias gitdiff="git diff \`git status -s |grep -v 'dist/' |cut -b4-\`"

alias startServer="cd $HOME/gits/clLib/server;. startServer.sh"
alias startApp="cd $HOME/gits/clLib;. startApp.sh"
alias startWeb="cd $HOME/gits/clLib;. startWeb.sh"

export PATH=${PATH}:/c/Program\ Files/MongoDB/Server/3.0/bin:${HOME}/_env:${HOME}/db_data



export MONGO_HOST=ds053438.mongolab.com:53438
export MONGO_DBNAME=climbinglog
export MONGO_USER=clAdmin
export MONGO_PWD=blerl1la

export CLLIB_HOME=/c/DEV/gits/clLib

export PATH=${PATH}:${CLLIB_HOME}/_env

export AWS_SECRET_ACCESS_KEY=0lZ1MDggnwPJPuQgwJVWx7UWnTMa0zg1/JtgwaJV
export AWS_ACCESS_KEY_ID=AKIAJ7GUMJYATJ6PPIZA


cd $CLLIB_HOME
