addpush:
	git add .
	git commit -m push
	ssh root@45.55.49.134 "cd ~/www/chatubot && git pull && pm2 restart all"

push:
	ssh root@45.55.49.134 "cd ~/www/chatubot && git pull && pm2 restart all"
