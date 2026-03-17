package com.thomas.auth_api.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données d'un exercice dans une séance d'entraînement")
public class ExercicesDto {

    private Integer id;
    @Schema(description = "Série d'une exercice", example = "4")
    private Integer sets;
    @Schema(description = "Répétitions d'une exercice", example = "10")
    private Integer repetitions;
    @Schema(description = "Poids utilisé pour l'exercice", example = "50")
    private Integer weight;
    @Schema(description = "Temps de repos entre les séries", example = "60")
    private Integer restTime;
    @Schema(description = "Nom du type d'exercice", example = "Développé couché")
    private String exerciceTypeName;
    @Schema(description = "Date de l'exercice", example = "2023-10-01")
    private String date;

    public ExercicesDto(Integer id, String exerciceTypeName, Integer sets, Integer repetitions, Integer weight, Integer restTime, String date) {
        this.id = id;
        this.exerciceTypeName = exerciceTypeName;
        this.sets = sets;
        this.repetitions = repetitions;
        this.weight = weight;
        this.restTime = restTime;
        this.date = date;
    }

     public ExercicesDto(Integer id, String exerciceTypeName, Integer sets, Integer repetitions, Integer weight, Integer restTime) {
        this.id = id;
        this.exerciceTypeName = exerciceTypeName;
        this.sets = sets;
        this.repetitions = repetitions;
        this.weight = weight;
        this.restTime = restTime;
    }
    
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getSets() {
        return sets;
    }
    public void setSets(Integer sets) {
        this.sets = sets;
    }
    public Integer getRepetitions() {
        return repetitions;
    }
    public void setRepetitions(Integer repetitions) {
        this.repetitions = repetitions;
    }
    public Integer getWeight() {
        return weight;
    }
    public void setWeight(Integer weight) {
        this.weight = weight;
    }
    public Integer getRestTime() {
        return restTime;
    }
    public void setRestTime(Integer restTime) {
        this.restTime = restTime;
    }
    public String getExerciceTypeName() {
        return exerciceTypeName;
    }
    public void setExerciceTypeName(String exerciceTypeName) {
        this.exerciceTypeName = exerciceTypeName;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

   
}
