#!/usr/bin/env bash
# intended to be run at the repo's root

alreadyPrinted=false

fixCli() {
    if [ "$alreadyPrinted" = false ]; then
        echo ""
        echo ""
        echo "Stopping Finance Vir servers. If your terminal goes all screwy run 'stty sane'"
        echo ""
        alreadyPrinted=true
    fi
    exit 0
}

trap fixCli SIGINT SIGTERM TERM

cwd="$(pwd)"
npm run start-frontend &
frontEndId=$!
echo "front-end pid: $frontEndId"
cd "$cwd" || exit
npm run start-backend &
backEndId=$!
echo "back-end pid: $backEndId"

echo "startup script: $$"
echo "kill with: sudo pkill -P $$"
pids=( "$frontEndId" "$backEndId" )
for pid in ${pids[*]}; do
    wait $pid
done