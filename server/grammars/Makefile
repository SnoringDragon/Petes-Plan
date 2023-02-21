.PHONY: clean all

all: CourseRequisitesLexer.js CourseRequisitesParser.js

%.interp %.js %.tokens: %.g4
	antlr4 -Dlanguage=JavaScript $*.g4 -no-listener

clean:
	rm *.js *.tokens *.interp
