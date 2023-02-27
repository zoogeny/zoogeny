#!/usr/bin/env bash

# make the build directory
mkdir -p build

# build story-self
pandoc -o build/story-self.epub ./story-self/*-draft.md
pandoc -o build/story-self.docx ./story-self/*-draft.md
