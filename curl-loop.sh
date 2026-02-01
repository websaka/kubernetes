# curl-loop.sh
URL="http://192.168.1.1:30011/login"
FORMAT="curl-format.txt"
LOG="curl-log.txt"

while true; do
  echo "$(date '+%Y-%m-%d %H:%M:%S')" >> $LOG
  curl -w "@$FORMAT" -o /dev/null -s $URL >> $LOG
  echo "" >> $LOG
  sleep 1
done

