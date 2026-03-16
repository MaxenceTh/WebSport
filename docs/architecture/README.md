# Architecture du Projet

![Schéma de l'architecture](./hercule-architecture.png)

## Description technique
L'application est basée sur une architecture 3-tiers (Fullstack) :

* **Frontend :** Développé avec **React 19.2** et **MUI 7**. Il communique avec le backend via des requêtes API sécurisées par **JWT**.
* **Backend (Dockerisé) :** Une API REST construite avec **Spring Boot 3.5.5** et **Java 17**. L'application est isolée dans un conteneur Docker pour garantir la portabilité.
* **Base de données :** **PostgreSQL** installée sur l'hôte.

## Flux de données et Ports
1. Le Frontend accède au Backend via le port mappé **8005** (`http://localhost:8005`).
2. Le Backend sort du conteneur Docker pour interagir avec PostgreSQL sur le port **5432** via l'adresse `host.docker.internal`.

## Amélioration : Dockerisation de la Base de Données

Initialement, PostgreSQL était installé localement sur la machine hôte. Le projet a été amélioré en intégrant la base de données directement dans l'écosystème Docker via **Docker Compose**. 

Voici les principaux avantages de cette architecture :

### 1. Configuration "One-Click" (Portabilité Totale)
* **Avant :** L'utilisateur devait installer PostgreSQL manuellement, créer la base de données et configurer les accès avant de lancer l'API.
* **Maintenant :** Une simple commande `docker-compose up` suffit. Docker télécharge, installe et configure automatiquement l'instance PostgreSQL avec les bons paramètres.
* **Bénéfice :** Le projet est désormais "clé en main".

### 2. Isolation et Propreté du Système
* **Avant :** PostgreSQL tournait en permanence comme service système, consommant des ressources et risquant des conflits de version avec d'autres projets.
* **Maintenant :** La base de données est isolée dans son propre conteneur. Elle ne consomme des ressources que lorsque le projet est actif. 
* **Bénéfice :** Possibilité de faire cohabiter plusieurs versions de Postgres sur la même machine sans aucun conflit.

### 3. Sécurité par le Réseau Privé
* **Avant :** La base de données était exposée sur le port `5432` de la machine hôte, accessible par n'importe quelle application locale.
* **Maintenant :** Grâce au réseau interne Docker, le conteneur PostgreSQL est invisible de l'extérieur. Seul le conteneur Spring Boot peut communiquer avec lui.
* **Bénéfice :** Une architecture sécurisée conforme aux standards de production.

### 4. Environnement Identique (Dev = Prod)
* **Avant :** Des différences entre la version locale (ex: Windows, Postgres 16) et le serveur de production (Linux, Postgres 15) pouvaient générer des bugs imprévus.
* **Maintenant :** L'utilisation de l'image officielle `postgres:15-alpine` garantit que l'environnement de développement est strictement identique à celui de production.
* **Bénéfice :** Élimination du problème "Mais ça marchait sur ma machine !".

### 5. Gestion Persistante des Données (Volumes)
* **Avant :** Les données étaient liées à l'installation locale de PostgreSQL.
* **Maintenant :** Utilisation de **Docker Volumes**. Les données sont stockées de façon persistante dans un dossier géré par Docker, indépendant du cycle de vie du conteneur.
* **Bénéfice :** Facilité de sauvegarde, de migration et de réinitialisation des données de test.
