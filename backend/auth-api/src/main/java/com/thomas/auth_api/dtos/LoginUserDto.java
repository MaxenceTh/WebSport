package com.thomas.auth_api.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données nécessaires pour l'authentification d'un utilisateur")
public class LoginUserDto {
    @Schema(description = "Adresse e-mail de l'utilisateur", example = "john.doe@gmail.com")
    private String email;
    @Schema(description = "Mot de passe de l'utilisateur", example = "password123")
    private String password;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    // getters and setters here...
}