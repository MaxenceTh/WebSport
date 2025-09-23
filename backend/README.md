# Spring Boot Security Guides

Ce dépôt contient des ressources et tutoriels pour sécuriser une application **Spring Boot 3**, incluant l’authentification JWT et le contrôle d’accès basé sur les rôles.

---

## 🔐 Sécuriser une application web Spring Boot

Guide officiel pour sécuriser une application web avec Spring Security :

[Securing a Web Application | Spring Guides](https://spring.io/guides/gs/securing-web)

---

## 📝 Implémentation de l’authentification JWT

Tutoriel détaillé pour implémenter **JWT (JSON Web Token)** dans Spring Boot 3 :

[Implement JWT authentication in a Spring Boot 3 application](https://medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application-5839e4fd8fac)

Ce tutoriel montre comment implémenter l'authentification par **JSON Web Token (JWT)** dans une application Spring Boot.  
Voici les principales étapes du processus :

1. Un **filtre d’authentification JWT** extrait et valide le token depuis l’en-tête de la requête.  
2. **Mettre en liste blanche** certaines routes API et protéger celles qui nécessitent un token.  
3. Réaliser l’authentification, générer le **JWT**, et définir un **temps d’expiration**.  
4. Utiliser le JWT généré pour accéder aux routes protégées.  
5. **Intercepter les exceptions d’authentification** afin de personnaliser la réponse envoyée au client.  

---

---

## 👥 Contrôle d’accès basé sur les rôles (RBAC)

Tutoriel pour mettre en place un **Role-Based Access Control** dans Spring Boot 3 :

[Implement Role-based Access Control in Spring Boot 3](https://medium.com/@tericcabrel/implement-role-based-access-control-in-spring-boot-3-a31c87c2be5c)

Ce projet illustre comment mettre en place un **Role Based Access Control (RBAC)** dans une application Spring Boot.
Voici les principales étapes du processus : 

1. Créer l'entité **Role** et la couche d'accès aux données (Repository).
2. Associer l'entité **User** à un **Role**.
3. Exposer le rôle de l'utilisateur dans le contexte d'authentification.
4. Activer la sécurité par méthodes avec Spring Security.
5. Protéger les routes avec les annotations de sécurité.
- **@PreAuthorize("isAuthenticated()")** --> accessible uniquement aux utilisateurs connectés.
- **@PreAuthorize("hasRole('ADMIN')")** --> accessible uniquement aux admins
- **@PreAuthorize("hasAnyRole('USER', "ADMIN")")** --> accessible à plusieurs types de rôles.

---

## 📌 Notes

- Ces guides sont compatibles avec **Spring Boot 3** et **Spring Security 6**.  
- Ils couvrent l’authentification, l’autorisation et la sécurisation des endpoints REST.  

---

## 📂 Documentation locale
  
- [securing-web](./securing-web) → Projet issu du guide officiel Spring Security  
- [auth-api](./auth-api) → Implémentation JWT et RBAC avec Spring Boot 3  
    - ### 📖 Documentation détaillée
        - [configs](./auth-api/docs/configs.md)

