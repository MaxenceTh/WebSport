# ⚖️ Différence de configuration Spring Security

Avec **Spring Security 6** (inclus dans Spring Boot 3), la configuration de la sécurité a changé.  
L’ancienne approche impérative est désormais **dépréciée** et remplacée par une écriture fonctionnelle avec lambdas.

---

## 🔴 Ancienne écriture (Spring Security ≤ 5.x)

```java
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf()
            .disable()
            .authorizeHttpRequests()
            .requestMatchers("/auth/**")
            .permitAll()
            .anyRequest()
            .authenticated()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

```
## 🟢 Nouvelle écriture (SPring Security 6.x / Boot 3.x)

```java
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/v3/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```


## 🔹 Configuration moderne de l'AuthenticationProvider

Avec Spring Security 6 (Spring Boot 3), le constructeur vide de `DaoAuthenticationProvider` et la méthode `setUserDetailsService()` sont **dépréciés**.  
La bonne pratique est de fournir directement le `UserDetailsService` dans le constructeur et de configurer le `PasswordEncoder` ensuite.

### 🔴 Ancienne version (dépréciée)

```java
@Bean
AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService());
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
}
```

### 🟢 Nouvelle version recommandée 
```java
@Bean
AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
                                              PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder);
    return authProvider;
}
```

[DaoAuthenticationProvider - Spring Security API](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/authentication/dao/DaoAuthenticationProvider.html)

