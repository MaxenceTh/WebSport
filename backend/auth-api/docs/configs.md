# API - Authentification et Sécurité

Ce document décrit la configuration de sécurité et le fonctionnement de l'authentification JWT dans l'application `auth-api`.

---

## 1️⃣ ApplicationConfiguration

Classe `ApplicationConfiguration` : définit les beans essentiels pour l'authentification.

### Beans

#### `UserDetailsService`

```java
@Bean
UserDetailsService userDetailsService()
```
- Charge un utilisateur depuis la base de données via **UserRepository**.
- Recherche par email et lève **UsernameNotFoundException** si non trouvé.
- Utilisé par **AuthenticationProvider** pour l'authentification.

### `PasswordEncoder`

```java
@Bean
BCryptPasswordEncoder passwordEncoder()
```
- Encode et vérifie les mots de passe des utilisateurs.
- Utilise l'algorithme **BCrypt**.

### `AuthenticationManager`

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception
```
- Gère le processus d'authentification global.
- Permet la génération de JWT après authentification.

### `AuthenticationProvider`

```java
@Bean
AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder)
```
- Configure un **DaoAuthenticationProvider** moderne compatible Spring Security 6.
- Fournit **UserDetailsService** directement dans le constructeur.
- Configure le **PasswordEncoder** via **setPasswordEncoder()**.
- Peut être injecté dans le **SecurityFilterChain**.

---

## 2️⃣ JwtAuthenticationFilter

Classe `JwtAuthenticationFilter` : filtre de sécurité pour gérer les JWT.

### Fonctionnement
- Intercepte chaque requête HTTP (**OncePerRequestFilter**).
- Vérifie la présence d'un header **Authorization: Bearer <token>**.
- Extrait l'email utilisateur du JWT via **JwtService**.
- Charge les détails utilisateur avec **UserDetailsService**.
- Valide le token JWT avec **jwtService.isTokenValid(...)**.
- Si valide, crée un **UsernamePasswordAuthenticationToken** et le met dans le **SecurityContext**.
- En cas d'erreur, la requête est gérée par **HandlerExceptionResolver**.

### Constructeur
```java
public JwtAuthenticationFilter(
    JwtService jwtService,
    UserDetailsService userDetailsService,
    HandlerExceptionResolver handlerExceptionResolver
)
```
- **jwtService**: service pour manipuler les JWT.
- **userDetailsService**: charge les utilisateurs depuis la DB.
- **handlerExceptionResolver**: gère les exceptions dans le filtre.

## 3️⃣ SecurityConfiguration

Classe `SecurityConfiguration`: définit la configuration de Spring Security.

### `SecurityFilterChain`
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
```
- Désactive CSRF (**http.csrf().disable()**).
- Autorise toutes les requêtes vers **/auth/..** et **/swagger-ui/** / **/v3/..**.
- Toutes les autres requêtes nécessitent une authentification.
- Politique de sessions: **STATELESS** (pour JWT).
- Injection de **AuthenticationProvider**
- Ajoute *JwtAuthenticationFilter** avant **UsernamePasswordAuthenticationFilter**

### `CorsConfiguration`
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
```
- Permet les requêtes depuis **http://localhost:8005**.
- Méthodes autorisées: **GET**, **POST**.
- Headers autorisés: **Authorization**, **Content-Type**.

## 4️⃣ Résumé
Cette configuration fournit:
- Un filtre JWT pour sécuriser les endpoints.
- Un AuthenticationProvider pour gérer l'authentification.
- Un UserDetailsService pour charger les utilisateurs depuis la base.
- Un PasswordEncoder pour encoder et vérifier les mots de passe.
- Une configuration CORS minimale pour le front local.
- Une SecurityFilterChain pour contrôler l'accès aux endpoints et gérer les sessions stateless.