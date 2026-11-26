# Runs the Open Trestle installer from the repository's default branch.
# Options are environment variables, such as $env:OPEN_TRESTLE_UNINSTALL = '1'.
& {
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
    Invoke-RestMethod -UseBasicParsing https://raw.githubusercontent.com/georgejieh/open-trestle/main/install.ps1 | Invoke-Expression
}
