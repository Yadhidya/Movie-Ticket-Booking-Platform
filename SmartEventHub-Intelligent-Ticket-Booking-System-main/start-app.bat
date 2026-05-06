@echo off
echo Starting SmartEventHub Backend and Tunnel...

:: Set JAVA_HOME to the correct JDK path
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

:: Navigate to backend and start Spring Boot in a new window
start "SmartEventHub Backend" /D "backend" cmd /k "mvnw.cmd spring-boot:run"

:: Wait a few seconds for backend to initialize
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

:: Start Localtunnel in a new window
start "SmartEventHub Tunnel" cmd /k "lt --port 8080 --subdomain smart-hub-2026"

echo.
echo ======================================================
echo Backend and Tunnel are starting in separate windows.
echo Keep those windows open while using the app!
echo Live Site: https://ticket-booking-fawn-alpha.vercel.app
echo ======================================================
pause
