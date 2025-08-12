package main

import "fmt"

type Logger struct {
	quiet bool
}

func (l *Logger) Info(format string, a ...any) {
	l.log("[ INFO ] ", format, a...)
}

func (l *Logger) Warn(format string, a ...any) {
	l.log("[ WARNING ] ", format, a...)
}

func (l *Logger) Error(format string, a ...any) {
	l.log("[ ERROR ] ", format, a...)
}

func (l *Logger) Success(format string, a ...any) {
	l.log("[ SUCCESS ] ", format, a...)
}

func (l *Logger) log(header, format string, a ...any) {
	if !l.quiet {
		fmt.Printf(header+format+"\n", a...)
	}
}
