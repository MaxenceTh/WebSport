package com.thomas.auth_api.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données d'une séance d'entraînement avec ses exercices")
public class SeanceWithExercicesDto {
    private Integer id;
    @Schema(description = "Nom de la séance", example = "Push Day")
    private String name;

    @Schema(description = "Liste des exercices de la séance")
    private Iterable<ExercicesDto> exercices;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Iterable<ExercicesDto> getExercices() {
        return exercices;
    }

    public void setExercices(Iterable<ExercicesDto> exercices) {
        this.exercices = exercices;
    }
}