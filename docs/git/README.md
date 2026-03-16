# 🌱 Gestion des branches Git

Ce guide résume les commandes principales pour gérer les branches dans Git.  
L’objectif est de travailler sur une branche **`dev`** pour le développement, puis fusionner sur **`main`** une fois le code validé.

---

## 📌 Créer une nouvelle branche
```bash
git checkout -b dev
```
👉 Crée une nouvelle branche appelée dev et se place dessus.

## 🔄 Changer de branche
```bash
git checkout dev
```
👉 Permet de passer sur la branche dev.

## 💾 Sauvegarder les changements
```bash
git add .
git commit -m "Message clair de la modification"
```
👉 Ajoute et enregistre les changements localement.

## ⬆️ Envoyer la branche vers GitHub
```bash
git push origin dev
```
👉 Envoie la branche dev sur le dépôt distant.

## 🔀 Fusionner dev dans main
1. Aller sur **main**:
```bash
git checkout main
```
2. Fusionner les changements de **dev**:
```bash
git merge dev
```
3. Pousser vers GitHub:
```bash
git push origin main
```

## 🧹 Supprimer une branche
```bash
git branch -d dev
```


## Cloner le projet original dans un dossier temporaire
```bash
git clone <url_du_projet_dashboard> C:\temp\Dashboard
```
## Supprimer le .git du projet cloné
```bash
Remove-Item -Recurse -Force C:\temp\Dashboard\.git
```
## Copier le projet dans ton dépôt cible
```bash
Copy-Item -Recurse C:\temp\Dashboard C:\Users\Projets\WebSport\frontend\
```
## Ajouter et commit dans ton dépôt
```bash
git add frontend/Dashboard
git commit -m "Ajout du Dashboard dans le dépôt frontend"
git push origin dev
```