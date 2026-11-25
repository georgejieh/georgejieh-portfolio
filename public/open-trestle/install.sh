#!/usr/bin/env bash
# Runs the Open Trestle installer from the repository's default branch.
# Options pass through: curl -fsSL https://georgejieh.dev/open-trestle/install.sh | bash -s -- --uninstall
open_trestle_stub() {
    set -o pipefail
    curl -fsSL --proto '=https' https://raw.githubusercontent.com/georgejieh/open-trestle/main/install.sh | bash -s -- "$@"
}
open_trestle_stub "$@"
