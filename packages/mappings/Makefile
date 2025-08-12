SRC := src/types/game.d.ts
OUT := dist/game.d.ts
VERSION := $(shell $(GET_PACKAGE_VERSION))

.PHONY: build clean

build: $(OUT)

$(OUT): $(SRC)
	mkdir -p dist/
	sed "s/__VERSION__/$(VERSION)/" $(SRC) > $(OUT)

clean:
	rm -rf dist/
