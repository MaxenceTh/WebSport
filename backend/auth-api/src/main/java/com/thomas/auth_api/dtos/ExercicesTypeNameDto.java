package com.thomas.auth_api.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données d'un type d'exercice")
public class ExercicesTypeNameDto {
    
    @Schema(description = "Nom du type d'exercice", example = "Développé couché")
    private String name;

    public ExercicesTypeNameDto(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
}
