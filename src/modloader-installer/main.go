package main

import (
	"bytes"
	_ "embed"
	"flag"
	"fmt"
	"os"
	"regexp"
	"slices"
)

const (
	indexHtmlFile = "win-unpacked/resources/app/game/index.html"
	mainJsFile    = "win-unpacked/resources/app/main.js"
	modloaderDir  = "modloader/"
	modloaderFile = modloaderDir + "modloader.js"
	modsDir       = "mods/"

	flagDevTools = "--dev"
)

var (
	injectModloaderScript = []byte("\t<script src=\"../../../../modloader/modloader.js\"></script>\n")
	injectModloaderRegex  = regexp.MustCompile("<script src=\"../../../../modloader/modloader.js\">\\s*</script>")
	injectModloaderBefore = []byte("</head>")

	injectDevToolsScript = []byte("\nipcMain.on('ml-dt', () => win.webContents.openDevTools());\n")
	injectDevToolsRegex  = regexp.MustCompile("ipcMain\\.on\\(['\"`]ml-dt['\"`], ?\\(\\) ?=> ?win\\.webContents\\.openDevTools\\(\\)\\);?")
)

// Chill out go, you'll get the file at compile time.

//go:embed modloader.js
var modloader []byte

type Flags struct {
	dev    bool
	nowait bool
}

func parseFlags() *Flags {
	flags := Flags{}
	flag.BoolVar(&flags.dev, "dev", false, "Install the DevTools opening hook")
	flag.BoolVar(&flags.nowait, "nowait", false, "Don't wait for user input after installation")

	flag.Parse()

	return &flags
}

func main() {
	flags := parseFlags()

	fmt.Println("[ INFO ] Installing modloader.")

	if !flags.nowait {
		defer func() {
			fmt.Println("\nPress [ENTER] to exit.")
			fmt.Scanln()
		}()
	}

	fmt.Printf("[ INFO ] Injecting modloader script into %q.\n", indexHtmlFile)

	data, err := os.ReadFile(indexHtmlFile)
	if err != nil {
		fmt.Printf(
			"[ ERROR ] Failed to open %q for modloader injection: %s\nDid you run the installer inside the \"Sixty Four\" game directory (next to \"win-unpacked\")?\n",
			indexHtmlFile, err)
		return
	}

	if injectModloaderRegex.Match(data) {
		fmt.Println("[ INFO ] Skipping step: modloader script already injected.")
	} else {
		i := bytes.Index(data, injectModloaderBefore)
		if i < 0 {
			fmt.Printf("[ ERROR ] Failed to inject modloader into %q.\n", indexHtmlFile)
			return
		}

		data = slices.Insert(data, i, injectModloaderScript...)

		if err := os.WriteFile(indexHtmlFile, data, 0644); err != nil {
			fmt.Printf("[ ERROR ] Failed to inject modloader into %q.\n", indexHtmlFile)
			return
		}
	}

	fmt.Println("[ INFO ] Unpacking modloader files.")

	err = createDir(modloaderDir)
	if err == nil {
		err = os.WriteFile(modloaderFile, modloader, 0644)
	}

	if err != nil {
		fmt.Printf("[ ERROR ] Failed to unpack modloader files: %s.\n", err)
		return
	}

	if err := createDir(modsDir); err != nil {
		fmt.Printf("[ WARNING ] Failed to create the %q directory: %s.\n", modsDir, err)
	}

	defer fmt.Printf("[ SUCCESS ] Successfully installed the modloader. Place your mod files (.js) into the %q directory.\n\n", modsDir)

	if !flags.dev {
		return
	}

	fmt.Printf("[ INFO ] %q flag present: Injecting dev tools hook into %q.\n", flagDevTools, mainJsFile)

	data, err = os.ReadFile(mainJsFile)
	if err != nil {
		fmt.Printf(
			"[ ERROR ] Failed to open %q for dev tools hook injection: %q.\n", mainJsFile, err)
		return
	}

	if injectDevToolsRegex.Match(data) {
		fmt.Printf("[ INFO ] Skipping step: dev tools hook already injected.\n")
		return
	}

	data = append(data, injectDevToolsScript...)

	if err := os.WriteFile(mainJsFile, data, 0644); err != nil {
		fmt.Printf("[ ERROR ] Failed to inject dev tools hook %q.\n", mainJsFile)
		return
	}

	fmt.Printf("[ SUCCESS ] Successfully injected the dev tools hook. Press \"Ctrl + Shift + I\" in game to open dev tools.\n")
}

func createDir(name string) error {
	if dir, err := os.Stat(name); err == nil && dir.IsDir() {
		return nil
	}

	return os.Mkdir(name, 0777)
}
