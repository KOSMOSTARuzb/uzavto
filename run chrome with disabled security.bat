@ECHO OFF
echo Launching chrome...
start chrome "%~dp0index.html" --user-data-dir="%~dp0ChromeDevSession" --disable-web-security
echo Launched
exit