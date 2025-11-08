package com.thomas.auth_api.dtos;

import java.util.Date;

public class WeightByDateDto {
    private Integer weight;
    private Date date;

    public WeightByDateDto(Integer weight, Date date) {
        this.weight = weight;
        this.date = date;
    }

    public Integer getWeight() { return weight; }
    public Date getDate() { return date; }
}
