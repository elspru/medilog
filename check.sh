#!/bin/bash
JSFILES="js/*js"
HTMLFILES="index.html mediapp.html"
xmllint $HTMLFILES
jshint $JSFILES
jslint $JSFILES
