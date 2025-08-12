export GET_PACKAGE_VERSION := node -e "console.log(require(\"./package.json\").version)"

export ESBUILD_BASE := pnpm exec esbuild \
	--bundle \
	--platform=node \
	--format=cjs \
	--target=es2023 \
	--supported:dynamic-import=false \
	--define:__VERSION__='"$$(shell $(GET_PACKAGE_VERSION))"'

.PHONY: all modloader modloader/clean mappings mappings/clean mods mods/clean clean .FORCE
.FORCE:

all: modloader mappings mods

modloader:
	$(MAKE) -C packages/modloader build

modloader/clean:
	$(MAKE) -C packages/modloader clean

# mappings targets are for artifact upload only
mappings:
	$(MAKE) -C packages/mappings build

mappings/clean:
	$(MAKE) -C packages/mappings clean

mods:
	for dir in packages/mods/*; do \
		$(MAKE) -C $$dir build; \
	done

mods/clean:
	for dir in packages/mods/*; do \
		$(MAKE) -C $$dir clean; \
	done

mod/%: .FORCE
	$(MAKE) -C packages/mods/$* build

mod/%/clean: .FORCE
	$(MAKE) -C packages/mods/$* clean

clean: modloader/clean mappings/clean mods/clean
