package main

import (
	"flag"
	"fmt"
	"os"
)

var name string
var version string

var usage = `Usage:  ./` + name + ` [options]

Unpacks mod loader and injects the necessary code into the game files.
Place inside the game directory (next to "win-unpacked").

Options:
  -h, --help     show this help message
  -d, --dev      set up dev tools opening hook
  -v, --version  show version of the embedded modloader
  -n, --nowait   don't wait for confirmation
  -q, --quiet    don't print log messages

`

type Flags struct {
	help    bool
	dev     bool
	version bool
	nowait  bool
	quiet   bool
}

func parseFlags() *Flags {
	flags := Flags{}

	if len(os.Args) < 2 {
		return &flags
	}

	expandFlags()

	flag.Usage = printUsage

	flag.BoolVar(&flags.help, "h", false, "")
	flag.BoolVar(&flags.help, "help", false, "")

	flag.BoolVar(&flags.dev, "d", false, "")
	flag.BoolVar(&flags.dev, "dev", false, "")

	flag.BoolVar(&flags.version, "v", false, "")
	flag.BoolVar(&flags.version, "version", false, "")

	flag.BoolVar(&flags.nowait, "n", false, "")
	flag.BoolVar(&flags.nowait, "nowait", false, "")

	flag.BoolVar(&flags.quiet, "q", false, "")
	flag.BoolVar(&flags.quiet, "quiet", false, "")

	flag.Parse()

	return &flags
}

func expandFlags() {
	expanded := []string{os.Args[0]}

	for _, arg := range os.Args[1:] {
		if len(arg) < 3 || arg[0] != '-' || arg[1] == '-' {
			expanded = append(expanded, arg)
			continue
		}

		for _, flag := range arg[1:] {
			expanded = append(expanded, "-"+string(flag))
		}
	}

	os.Args = expanded
}

func printUsage() {
	fmt.Print(usage)
}
