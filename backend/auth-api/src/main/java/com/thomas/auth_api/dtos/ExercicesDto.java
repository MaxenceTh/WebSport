package com.thomas.auth_api.dtos;

public class ExercicesDto {

    private Integer id;
    private Integer sets;
    private Integer repetitions;
    private Integer weight;
    private Integer restTime;
    private String exerciceTypeName;

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

   
}
