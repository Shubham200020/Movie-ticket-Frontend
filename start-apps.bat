@echo off
echo Starting Movie Ticket Backend (.NET)...
start "Backend Server" cmd /k "cd /d "%~dp0..\dotnet-movie-api" && dotnet run --launch-profile https"

echo Waiting a few seconds for the backend to spin up before starting Angular...
timeout /t 7 /nobreak > nul

echo Starting Movie Ticket Frontend (Angular)...
start "Frontend Server" cmd /k "cd /d "%~dp0" && npm run start"

echo Both applications are now starting in separate windows!
