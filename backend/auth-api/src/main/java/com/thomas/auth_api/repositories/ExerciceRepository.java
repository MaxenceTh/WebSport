package com.thomas.auth_api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.entities.gym.Exercice;

public interface ExerciceRepository extends CrudRepository<Exercice, Integer> {

    Exercice findTopByExerciceType_NameAndSeance_UserOrderByWeightDesc(String name, User user);

    @Query("SELECT DISTINCT e.exerciceType.name FROM Exercice e WHERE e.seance.user = :user")
    List<String> findDistinctExerciceTypeNamesByUser(@Param("user") User user);

    @Query("SELECT e.weight, e.createdAt FROM Exercice e WHERE e.exerciceType.name = :exerciceName AND e.seance.user = :user ORDER BY e.createdAt ASC")
    List<Object[]> findWeightsByExerciceAndUser(@Param("exerciceName") String exerciceName, @Param("user") User user);

}
