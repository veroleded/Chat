install:
	npm ci
	make -C frontend install

start-backend: 
	npx start-server

lint-frontend:
	make -C frontend lint


start-frontend:
	make -C frontend start

deploy:
	git push heroku main

start:
	make start-backend & make start-frontend