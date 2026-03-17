package com.thomas.auth_api.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données d'un utilisateur")
public class UserDto {
    private Integer id;
    @Schema(description = "Nom complet de l'utilisateur", example = "John Doe")
    private String fullName;
    @Schema(description = "Adresse e-mail de l'utilisateur", example = "john.doe@gmail.com")
    private String email;
    @Schema(description = "Rôle de l'utilisateur", example = "ROLE_USER")
    private String roleName;

    public UserDto(Integer id, String fullName, String email, String roleName) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.roleName = roleName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

}
