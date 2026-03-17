package com.thomas.auth_api.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données nécessaires pour l'inscription d'un nouvel utilisateur")
public class RegisterUserDto {
    @Schema(description = "Adresse e-mail de l'utilisateur", example = "john.doe@gmail.com")
    private String email;
    
    @Schema(description = "Mot de passe de l'utilisateur", example = "password123")
    private String password;
    
    @Schema(description = "Nom complet de l'utilisateur", example = "John Doe")
    private String fullName;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    // getters and setters here...
}