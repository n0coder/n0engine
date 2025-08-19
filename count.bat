@echo off
setlocal EnableDelayedExpansion

:: Initialize counters
set total_lines=0
set total_characters=0
set script_count=0

:: Process engine directory
cd engine
for /r %%F in (*.mjs) do (
    set /a lines=0
    set /a characters=0
    
    :: Count lines
    for /f %%L in ('type "%%F" ^| find /c /v ""') do set lines=%%L
    
    :: Count characters
    for /f %%C in ('powershell -command "Get-Content '%%F' | Measure-Object -Character | Select-Object -ExpandProperty Characters"') do set characters=%%C
    
    set /a total_lines+=lines
    set /a total_characters+=characters
    set /a script_count+=1
    
    echo Total lines %%F: !lines! (!total_lines!)
    echo Total characters %%F: !characters! (!total_characters!)
)
cd ..

:: Process game directory
cd game
for /r %%F in (*.mjs) do (
    set /a lines=0
    set /a characters=0
    
    :: Count lines
    for /f %%L in ('type "%%F" ^| find /c /v ""') do set lines=%%L
    
    :: Count characters
    for /f %%C in ('powershell -command "Get-Content '%%F' | Measure-Object -Character | Select-Object -ExpandProperty Characters"') do set characters=%%C
    
    set /a total_lines+=lines
    set /a total_characters+=characters
    set /a script_count+=1
    
    echo Total lines %%F: !lines! (!total_lines!)
    echo Total characters %%F: !characters! (!total_characters!)
)
cd ..

:: Calculate averages
set /a average_lines=total_lines / script_count
set /a average_characters=total_characters / script_count

:: Print results
echo Average lines per script: %average_lines%
echo Average characters per script: %average_characters%
echo Total Scripts: %script_count%
echo Total lines: %total_lines%
echo Total characters: %total_characters%

endlocal