package com.thomas.auth_api.dtos;

import java.util.List;


public class SeanceUserDto {
    private String name;
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
