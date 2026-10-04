@echo off
title Copy Profile Photo to Portfolio Assets
echo =======================================================
echo Copying Sayed Mohamed's profile photo to portfolio...
echo =======================================================

if not exist "assets\images" (
    mkdir "assets\images"
)

copy /Y "C:\Users\Sayed.Saady\.gemini\antigravity\brain\a23e6404-01d4-476c-adb4-8a2b70dd5bc8\.user_uploaded\media_1790839241633.jpg" "assets\images\sayed-mohamed.jpg"
copy /Y "C:\Users\Sayed.Saady\.gemini\antigravity\brain\a23e6404-01d4-476c-adb4-8a2b70dd5bc8\.user_uploaded\media_1790839241633.jpg" "sayed-mohamed.jpg"

echo.
echo [SUCCESS] Your photo was copied successfully to:
echo  - assets\images\sayed-mohamed.jpg
echo  - sayed-mohamed.jpg
echo.
echo You can now refresh index.html to see your photo!
echo.
pause
