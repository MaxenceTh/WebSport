package com.thomas.auth_api.repositories;


import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


import com.thomas.auth_api.entities.gym.ExerciceType;

@Repository
public interface ExerciceTypeRepository extends CrudRepository<ExerciceType, Integer> {

    Optional<ExerciceType> findByName(String name);
    
}

