package com.thomas.auth_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.thomas.auth_api.entities.gym.Seance;



@Repository
public interface SeanceRepository extends JpaRepository<Seance, Integer> {
    
}