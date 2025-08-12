ESBUILD := $(ESBUILD_BASE) --external:electron --format=iife

MODLOADER_SRC := src/index.ts
MODLOADER_SRC_ALL := $(wildcard src/*.ts) $(wildcard src/**/*.ts)
export MODLOADER_OUT := dist/modloader.js

TYPES_SRC := src/types/modloader.d.ts
TYPES_OUT := dist/modloader.d.ts

export VERSION := $(shell $(GET_PACKAGE_VERSION))

.PHONY: build installer clean

build: $(MODLOADER_OUT) $(TYPES_OUT) installer

$(MODLOADER_OUT): $(MODLOADER_SRC_ALL)
	$(ESBUILD) $(MODLOADER_SRC) --outfile=$(MODLOADER_OUT)

$(TYPES_OUT): $(TYPES_SRC)
	mkdir -p dist/
	sed "s/__VERSION__/$(VERSION)/" $(TYPES_SRC) > $(TYPES_OUT)

installer:
	$(MAKE) -C installer build

clean:
	rm -rf dist/
	$(MAKE) -C installer clean
