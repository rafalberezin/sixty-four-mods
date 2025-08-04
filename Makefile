MODLOADER_SRC := src/modloader/index.ts
MODLOADER_SRC_ALL := $(wildcard src/modloader/*.ts) $(wildcard src/modloader/**/*.ts)
MODLOADER_OUT := dist/modloader/modloader.js

INSTALLER_SRC := src/modloader-installer/main.go
INSTALLER_EMBED := src/modloader-installer/modloader.js
INSTALLER_OUT := dist/modloader/modloader-installer.exe

MODS_SRC := src/mods
MOD_NAMES := $(notdir $(shell find $(MODS_SRC) -mindepth 2 -maxdepth 2 -name "index.ts" -exec dirname {} \;))

ESBUILD := pnpm exec esbuild \
	--bundle \
	--platform=node \
	--format=cjs \
	--target=es2023 \
	--external:electron \
	--supported:dynamic-import=false \

.PHONY: all modloader mods

all: modloader mods

modloader: $(INSTALLER_OUT)

$(MODLOADER_OUT): $(MODLOADER_SRC_ALL)
	$(ESBUILD) "$(MODLOADER_SRC)" --outfile="$(MODLOADER_OUT)" --format=iife

$(INSTALLER_OUT): $(INSTALLER_SRC) $(MODLOADER_OUT)
	cp "$(MODLOADER_OUT)" "$(INSTALLER_EMBED)"
	go build -o "$(INSTALLER_OUT)" "$(INSTALLER_SRC)"
	rm -f "$(INSTALLER_EMBED)"

mods: $(MOD_NAMES:%=dist/%.js)

dist/%.js: src/mods/%/index.ts
	$(ESBUILD) "$<" --outfile="$@"
