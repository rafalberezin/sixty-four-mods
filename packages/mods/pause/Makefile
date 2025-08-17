NAME := $(notdir $(CURDIR))
SRC := src/index.ts
OUT := dist/$(NAME).js

.PHONY: build clean

build: $(OUT)

$(OUT): $(SRC)
	$(ESBUILD_BASE) $(SRC) --outfile=$(OUT)

clean:
	rm -rf dist/
