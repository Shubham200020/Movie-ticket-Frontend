@echo off
echo 1. Making sure EF Core tools are installed...
dotnet tool install --global dotnet-ef 2>nul

echo 2. Stopping any running backend servers...
taskkill /f /im dotnet.exe 2>nul

echo 3. Running Entity Framework Migrations...
cd /d "%~dp0..\dotnet-movie-api"
dotnet ef migrations add AddScreenType
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to create migration! Please read the red text above.
    pause
    exit /b
)

dotnet ef database update
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to update the database! Please read the red text above.
    pause
    exit /b
)

echo.
echo [SUCCESS] Migrations applied perfectly! You can now close this window and double click start-apps.bat.
pause
