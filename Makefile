IMAGE = invekotin-dev
CONTAINERS_RUNNING = $(shell docker ps | grep $(IMAGE) > /dev/null; echo $$?)

build: .env
	docker build .

# at the moment we need only once instance
run: .env
ifneq ($(CONTAINERS_RUNNING), 0)
	docker-compose up
else
	@echo 'Containers already running!'
endif

clean:
	docker-compose down
clean-image: clean
	docker image rm $(IMAGE)
