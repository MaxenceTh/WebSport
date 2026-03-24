# Documentation du Test Unitaire : `registerUserTest`

Ce document détaille le fonctionnement technique du test d'inscription situé dans `AuthenticationControllerTest`.

---

## Objectif du Test
L'objectif est de vérifier que la **couche Web** (le Contrôleur) remplit correctement son contrat sans dépendre de la base de données ou de la logique métier réelle. On s'assure que :
* ✅ La requête JSON est bien réceptionnée et désérialisée.
* ✅ Le service d'authentification est sollicité avec les bons paramètres.
* ✅ La réponse HTTP est un **200 OK** contenant les informations de l'utilisateur.

---

## Architecture du Test (Pattern Gherkin)
Le test suit la structure logique **GIVEN / WHEN / THEN**.

### GIVEN : Préparation du scénario
On crée des objets fictifs (**Mocks**) pour simuler les entrées et sorties.

* **Le DTO (`RegisterUserDto`)** : Simule les données envoyées par un utilisateur (Frontend/Postman).
* **Le MockRole & MockUser** : Prépare l'objet que le service doit renvoyer.
  > ** Note technique :** On définit un `Role` car l'entité `User` appelle `role.getName()` lors de la conversion en JSON. Sans cela, le test échouerait avec une `NullPointerException` (Erreur 500).

* **L'instruction Mockito (`when...thenReturn`)** : 
  On "programme" le comportement du service simulé.
  ```java
  when(authenticationService.signup(any(RegisterUserDto.class))).thenReturn(mockUser);
  ```

### WHEN : Exécution de l'action
On simule l'appel HTTP réel à l'aide de MockMvc.
  ```java
 mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(registerDto)))
  ```
- **post("/auth/signup")** : Cible l'endpoint de l'API.

- **objectMapper** : Transforme l'objet Java en chaîne JSON brute pour le corps de la requête.

### THEN : Vérification des résultats
On valide la réponse du serveur.
 ```java
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.email").value("thomas@test.com"))
    .andExpect(jsonPath("$.fullName").value("Thomas Dev"));
  ```

- **status().isOk()** : Vérifie que le code de statut HTTP est 200.

- **jsonPath("$.email")** : Analyse le corps de la réponse JSON pour confirmer que les données renvoyées correspondent à notre mockUser.