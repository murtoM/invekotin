IMAGE = invekotin-dev

build:
	docker build .

run:
	docker-compose up

clean:
	docker-compose down
clean-image:
	docker image rm $(IMAGE)
