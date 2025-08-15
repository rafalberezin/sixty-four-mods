MODLOADER_RELATIVE := ../$(MODLOADER_OUT)

EMBED_DIR := embed/
EMBED := $(EMBED_DIR)modloader.js

LDFLAGS = -ldflags="-s -w -X main.name=$(notdir $(1)) -X main.version=$(VERSION)"

OUT_WINDOWS := ../dist/modloader-installer-windows.exe
OUT_LINUX := ../dist/modloader-installer-linux

.PHONY: build clean embed-placeholder

build: $(OUT_WINDOWS) $(OUT_LINUX)

$(OUT_WINDOWS): $(EMBED) *.go
	GOOS=windows GOARCH=amd64 \
	go build $(call LDFLAGS,$@) -o $@ .

$(OUT_LINUX): $(EMBED) *.go
	GOOS=linux GOARCH=amd64 \
	go build $(call LDFLAGS,$@) -o $@ .

$(EMBED): $(MODLOADER_RELATIVE)
	mkdir -p $(EMBED_DIR)
	cp $(MODLOADER_RELATIVE) $(EMBED)

embed-placeholder:
	mkdir -p $(EMBED_DIR)
	touch $(EMBED)

clean:
	rm -rf $(EMBED_DIR)
