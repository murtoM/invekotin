IMAGE = invekotin-dev
DB_VOLUME = invekotin_mongodb-data

CONTAINERS_RUNNING = $(shell docker ps | grep $(IMAGE) > /dev/null; echo $$?)

build: .env
	docker build .

run: up

# at the moment we need only once instance
up: .env
ifneq ($(CONTAINERS_RUNNING), 0)
	docker-compose up
else
	@echo 'Containers already running!'
endif

start:
	docker-compose start
stop:
	docker-compose stop

down:
	docker-compose down
clean: down
	docker image rm $(IMAGE)
	docker volume rm $(DB_VOLUME)
