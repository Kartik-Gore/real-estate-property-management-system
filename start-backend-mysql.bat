@echo off
echo ===================================================================
echo Starting Capgemini Real Estate Spring Boot Backend (MySQL Profile)
echo Database: realestate_db on localhost:3306
echo ===================================================================
cd backend
tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
pause
