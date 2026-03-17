package com.thomas.auth_api.dtos;

import java.util.Date;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Données du poids d'un utilisateur à une date donnée")
public class WeightByDateDto {
    @Schema(description = "Poids de l'utilisateur en kilogrammes", example = "75")
    private Integer weight;
    @Schema(description = "Date à laquelle le poids a été enregistré", example = "2023-10-01")
    private Date date;

    public WeightByDateDto(Integer weight, Date date) {
        this.weight = weight;
        this.date = date;
    }

    public Integer getWeight() { return weight; }
    public Date getDate() { return date; }
}
