# page refs
PAGE= \
	com/uztez/portal/Application.js

# next develop directory
NEXT_DEV_DIR:=../next
NEXT_LIB_DIR:=lib/next

PAGE_SCRIPTS=$(shell echo $(PAGE) | sed -n '1h;1!H;$${x;s/\(\S*\)/<script type="text\/javascript" src="\1"><\/script>/g;p}')

NEXT_DIR=$(if $(DEV),$(NEXT_DEV_DIR), $(NEXT_LIB_DIR))
NEXT_DIR_ESC=$(shell printf $(NEXT_DIR) | sed -e 's/\//\\\//g' | sed -e 's/\./\\\./g')
NEXT_SCRIPTS_SRC=$(shell cat $(NEXT_DEV_DIR)/work/test/next-web.html | sed -n '1h;1!H;$${x;s/.*<!-- Test Code Start -->\r\?\n\s*\(.*\)\r\?\n\s*<!-- Test Code End -->.*/\1/g;p}' | sed -n '1h;1!H;$${x;s/\.\.\/\.\.\/next-/$(NEXT_DIR_ESC)\/next-/g;p}')
NEXT_SCRIPTS_DIST=<script type="text/javascript" src="lib/next/dist/next-web.min.js"></script>
NEXT_SCRIPTS=$(if $(DIST),$(NEXT_SCRIPTS_DIST),$(NEXT_SCRIPTS_SRC))

all: dist

dist: DIST=yes
dist: FORCE clean lib-next index.html

debug: DEBUG=yes
debug: FORCE clean lib-next index.html

dev: DEV=yes
dev: FORCE clean lib-next index.html

clean-next: FORCE
	@printf "Clear next ... "
	@mkdir -p lib
	@mkdir -p $(NEXT_LIB_DIR)
	@rm -rf $(NEXT_LIB_DIR)/*
	@printf "done.\n"

clean-index: FORCE
	@printf "Clean index.html ... "
	@rm -f index.html
	@printf "done.\n"

clean: FORCE clean-index clean-next

lib-next: FORCE
	@printf "Copy next ... "
	@mkdir -p $(NEXT_LIB_DIR)
	@cp -R $(NEXT_DEV_DIR)/next-* $(NEXT_LIB_DIR)/
	@mkdir -p $(NEXT_LIB_DIR)/dist
	@cp $(NEXT_DEV_DIR)/work/dist/next-*.js $(NEXT_LIB_DIR)/dist
	@printf "done.\n"

index.html: FORCE
	@printf "Update index.html ... "
	@cp dev/index.template.html index.html
	@sed index.html -e 's!\$$NEXT!$(NEXT_SCRIPTS)!g' -i
	@sed index.html -e 's!\$$PAGE!$(PAGE_SCRIPTS)!g' -i
	@html-beautify index.html -r > /dev/null
	@printf "done.\n"

FORCE:
