#!/usr/bin/env bash

set -e

deno fmt
deno check *.ts
deno lint *.ts "lib/**/*.ts"