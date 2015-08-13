addpush:
	git add .
	git commit -m push
	git push
	ssh root@45.55.49.134 "cd ~/www/wechat-eliza/ && git pull && pm2 restart all"

push:
	ssh root@45.55.49.134 "cd ~/www/wechat-eliza/ && git pull && pm2 restart all"
