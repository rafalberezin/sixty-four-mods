package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"os"
	"slices"
)

const (
	indexPath     = "win-unpacked/resources/app/game/index.html"
	modloaderDir  = "modloader/"
	modloaderPath = modloaderDir + "modloader.js"
	modsPath      = "mods/"
)

var (
	importScript = []byte("<script src=\"../../../../modloader/modloader.js\"></script>\n")
	injectBefore = []byte("</head>")
)

// Chill out go-staticcheck, you'll get the file at compile time.

//go:embed modloader.js
var modloader []byte

func main() {
	fmt.Println("[ INFO ] Installing modloader.")

	defer func() {
		fmt.Print("Press [ENTER] to exit.")
		fmt.Scanln()
	}()

	fmt.Printf("[ INFO ] Injecting modloader script into %q.\n", indexPath)

	data, err := os.ReadFile(indexPath)
	if err != nil {
		fmt.Printf(
			"[ ERROR ] Failed to open %q for modloader injection: %s\nDid you run the installer inside the \"Sixty Four\" game directory (next to \"win-unpacked\")?\n\n",
			indexPath, err)
		return
	}

	if bytes.Contains(data, importScript) {
		fmt.Printf("[ INFO ] Skipping step: modloader script already injected.\n")
	} else {
		i := bytes.Index(data, injectBefore)
		if i < 0 {
			fmt.Printf("[ ERROR ] Failed to inject modloader into %q.\n\n", indexPath)
			return
		}

		data = slices.Insert(data, i, importScript...)

		if err := os.WriteFile(indexPath, data, 0666); err != nil {
			fmt.Printf("[ ERROR ] Failed to inject modloader into %q.\n\n", indexPath)
			return
		}
	}

	fmt.Println("[ INFO ] Unpacking modloader files.")

	err = createDir(modloaderDir)
	if err == nil {
		err = os.WriteFile(modloaderPath, modloader, 0666)
	}

	if err != nil {
		fmt.Printf("[ ERROR ] Failed to unpack modloader files: %s.\n\n", err)
		return
	}

	if err := createDir(modsPath); err != nil {
		fmt.Printf("[ WARNING ] Failed to create the %q directory: %s.\n", modsPath, err)
	}

	fmt.Printf("[ SUCCESS ] Successfully installed the modloader. Place your mod files (.js) into the %q directory.\n\n", modsPath)
}

func createDir(name string) error {
	if dir, err := os.Stat(name); err == nil && dir.IsDir() {
		return nil
	}

	return os.Mkdir(name, 0777)
}
