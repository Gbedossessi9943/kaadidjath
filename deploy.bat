@echo off
echo ========================================
echo   Kadidjath - Deploiement GitHub
echo ========================================
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installé!
    echo 📥 Veuillez télécharger Git depuis: https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo ✅ Git est installé
echo.

REM Initialiser Git si nécessaire
if not exist .git (
    echo 🔄 Initialisation du repository Git...
    git init
    echo.
)

REM Configurer Git si nécessaire
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚙️  Configuration de Git...
    set /p username=Entrez votre nom GitHub: 
    set /p email=Entrez votre email GitHub: 
    git config --global user.name "%username%"
    git config --global user.email "%email%"
    echo.
)

REM Ajouter les fichiers
echo 📁 Ajout des fichiers au repository...
git add .
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'ajout des fichiers
    pause
    exit /b 1
)

REM Commit
echo 💾 Commit des changements...
git commit -m "Deploy Kadidjath Platform - Complete E-commerce Solution"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du commit
    pause
    exit /b 1
)

REM Vérifier si le remote existe
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Configuration du repository distant...
    echo.
    echo 📝 Instructions:
    echo 1. Allez sur https://github.com
    echo 2. Creez un nouveau repository nomme "kadidjath-platform"
    echo 3. Copiez l'URL du repository (ex: https://github.com/votrenom/kadidjath-platform.git)
    echo.
    set /p github_url=Entrez l'URL de votre repository GitHub: 
    git remote add origin "%github_url%"
    echo.
)

REM Push vers GitHub
echo 🚀 Envoi vers GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push vers GitHub
    echo 💡 Verifiez vos identifiants GitHub
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Succes! Votre projet est sur GitHub!
echo.
echo 🌐 Prochaines etapes:
echo 1. Allez sur votre repository GitHub
echo 2. Cliquez sur "Settings" > "Pages"
echo 3. Activez GitHub Pages
echo 4. Votre site sera disponible en quelques minutes
echo.
echo 📱 Votre URL sera: https://VOTRE_USERNAME.github.io/kadidjath-platform/
echo.
echo 🎉 Felicitations! Kadidjath est en ligne!
echo.

pause
