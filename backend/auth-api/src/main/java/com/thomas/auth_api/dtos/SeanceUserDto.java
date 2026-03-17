package com.thomas.auth_api.dtos;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données nécessaires pour créer une séance avec ses exercices")
public class SeanceUserDto {
    @Schema(description = "Nom de la séance", example = "Push Day")
    private String name;
    @Schema(description = "Liste des exercices inclus dans la séance")
    private List<ExercicesDto> exercices;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ExercicesDto> getExercices() {
        return exercices;
    }

    public void setExercices(List<ExercicesDto> exercices) {
        this.exercices = exercices;
    }

}
