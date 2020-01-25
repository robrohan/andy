
start:
	npm run start

build: clean
	npm run build
	rm dist/*.wav

clean:
	rm -rf dist
