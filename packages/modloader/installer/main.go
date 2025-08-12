package main

import (
	"bytes"
	_ "embed"
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
)

var (
	injectModloaderScript = []byte("\t<script src=\"../../../../modloader/modloader.js\"></script>\n")
	injectModloaderRegex  = regexp.MustCompile("<script src=\"../../../../modloader/modloader.js\">\\s*</script>")
	injectModloaderBefore = []byte("</head>")

	injectDevToolsScript = []byte("\nipcMain.on('ml-dt', () => win.webContents.openDevTools());\n")
	injectDevToolsRegex  = regexp.MustCompile("ipcMain\\.on\\(['\"`]ml-dt['\"`], ?\\(\\) ?=> ?win\\.webContents\\.openDevTools\\(\\)\\);?")
)

//go:embed embed/modloader.js
var modloader []byte

var logger = &Logger{}

func main() {
	flags := parseFlags()
	logger.quiet = flags.quiet

	if flags.help {
		printUsage()
		return
	}

	if flags.version {
		fmt.Println(version)
		return
	}

	status := installModloader()

	if status == 0 && flags.dev {
		status = installDevTools()
	}

	if !flags.nowait {
		fmt.Println("\nPress [ENTER] to exit.")
		fmt.Scanln()
	}

	os.Exit(status)
}

func installModloader() int {
	logger.Info("Installing mod loader.")

	logger.Info("Injecting mod loader script into %q.", indexHtmlFile)

	data, err := os.ReadFile(indexHtmlFile)
	if err != nil {
		logger.Error(
			"Failed to open %q for mod loader injection: %s\n"+
				"Did you run the installer inside the \"Sixty Four\" game directory? (next to \"win-unpacked\")",
			indexHtmlFile, err,
		)
		return 1
	}

	if injectModloaderRegex.Match(data) {
		logger.Info("Skipping step: mod loader script already injected.")
	} else {
		i := bytes.Index(data, injectModloaderBefore)
		if i < 0 {
			logger.Error("Failed to inject mod loader into %q.", indexHtmlFile)
			return 1
		}

		data = slices.Insert(data, i, injectModloaderScript...)

		if err := os.WriteFile(indexHtmlFile, data, 0644); err != nil {
			logger.Error("Failed to inject mod loader into %q.", indexHtmlFile)
			return 1
		}
	}

	logger.Info("Unpacking mod loader files.")

	err = createDir(modloaderDir)
	if err == nil {
		err = os.WriteFile(modloaderFile, modloader, 0644)
	}

	if err != nil {
		logger.Error("Failed to unpack mod loader files: %s", err)
		return 1
	}

	if err := createDir(modsDir); err != nil {
		logger.Warn("Failed create the mods directory %q: %s", modsDir, err)
	}

	logger.Success(
		"Successfully installed the mod loder.\n"+
			"Place your mod files (.js) into the %q directory.",
		modsDir,
	)

	return 0
}

func installDevTools() int {
	logger.Info("Installing dev tools hook.")

	logger.Info("Injecting dev tools script into %q.", mainJsFile)

	data, err := os.ReadFile(mainJsFile)
	if err != nil {
		logger.Error(
			"Failed to open %q for dev tools script injection: %s",
			indexHtmlFile, err,
		)
		return 1
	}

	if injectDevToolsRegex.Match(data) {
		logger.Info("Skipping step: dev tools script already injected.")
		return 0
	}

	data = append(data, injectDevToolsScript...)

	if err := os.WriteFile(mainJsFile, data, 0644); err != nil {
		logger.Error("Failed to inject dev tools script into %q.", mainJsFile)
		return 1
	}

	logger.Success(
		"Successfully installed the dev tools script.\n" +
			"Press \"Ctrl + Shift + I\" in the game to open dev tools.",
	)

	return 0
}

func createDir(name string) error {
	if dir, err := os.Stat(name); err == nil && dir.IsDir() {
		return nil
	}

	return os.Mkdir(name, 0777)
}
