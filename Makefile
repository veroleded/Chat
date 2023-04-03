install:
	npm ci & cd frontend && npm ci

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