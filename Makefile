IMAGE = invekotin-dev

build: .env
	docker build .

run: .env
	docker-compose up

clean:
	docker-compose down
clean-image:
	docker image rm $(IMAGE)
