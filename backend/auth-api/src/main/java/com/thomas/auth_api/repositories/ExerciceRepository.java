package com.thomas.auth_api.repositories;

import org.springframework.data.repository.CrudRepository;

import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.entities.gym.Exercice;


public interface  ExerciceRepository extends CrudRepository<Exercice, Integer> {
    
    Exercice findTopByExerciceType_NameAndSeance_UserOrderByWeightDesc(String name, User user);
}
