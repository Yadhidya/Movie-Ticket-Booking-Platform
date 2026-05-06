@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET ___MVNW_WDIR=%~dp0
@IF "%MVNW_VERBOSE%"=="" (
  @SET MVNW_VERBOSE=false
)
@IF "%MVNW_USERNAME%"=="" (
  @SET MVNW_USERNAME=%USERNAME%
)

@SET _MVNW_PROPS=%___MVNW_WDIR%.mvn\wrapper\maven-wrapper.properties

@FOR /F "usebackq tokens=1,2 delims==" %%a IN ("%_MVNW_PROPS%") DO (
  @IF "%%a"=="distributionUrl" (SET MVNW_DISTRIBUTION_URL=%%b)
)

@IF "%MVNW_DISTRIBUTION_URL%"=="" (
  @ECHO Error: distributionUrl not found in .mvn\wrapper\maven-wrapper.properties >&2
  @EXIT /B 1
)

@REM Determine the distribution filename
@FOR %%F IN ("%MVNW_DISTRIBUTION_URL%") DO (SET _MVNW_DISTRIBUTION_FILENAME=%%~nxF)

@SET _MVNW_DISTRIBUTION_ID=%_MVNW_DISTRIBUTION_FILENAME:~0,-4%
@SET _MVNW_DIST_HOME=%USERPROFILE%\.m2\wrapper\dists\%_MVNW_DISTRIBUTION_ID%

@IF EXIST "%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.cmd" (
  @SET MVN_EXEC=%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.cmd
  @GOTO mvnExec
)
@IF EXIST "%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.bat" (
  @SET MVN_EXEC=%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.bat
  @GOTO mvnExec
)

@ECHO Downloading Maven from %MVNW_DISTRIBUTION_URL% ...
@MD "%_MVNW_DIST_HOME%" 2>NUL
@powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%MVNW_DISTRIBUTION_URL%' -OutFile '%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_FILENAME%' }"
@IF NOT EXIST "%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_FILENAME%" (
  @ECHO Error: Download failed >&2
  @EXIT /B 1
)

@ECHO Extracting Maven ...
@powershell -Command "& { Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_FILENAME%', '%_MVNW_DIST_HOME%') }"
@DEL "%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_FILENAME%"
@ECHO Maven extracted successfully.

@IF EXIST "%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.cmd" (
  @SET MVN_EXEC=%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.cmd
  @GOTO mvnExec
)
@IF EXIST "%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.bat" (
  @SET MVN_EXEC=%_MVNW_DIST_HOME%\%_MVNW_DISTRIBUTION_ID%\bin\mvn.bat
  @GOTO mvnExec
)

@ECHO Error: Could not find mvn after extraction >&2
@EXIT /B 1

:mvnExec
@SET MAVEN_OPTS=%MAVEN_OPTS%
@"%MVN_EXEC%" %*
