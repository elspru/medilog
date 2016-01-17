#!/bin/bash
JSFILES="js/*js"
HTMLFILES="index.html"
xmllint $HTMLFILES
jshint $JSFILES
jslint $JSFILES
