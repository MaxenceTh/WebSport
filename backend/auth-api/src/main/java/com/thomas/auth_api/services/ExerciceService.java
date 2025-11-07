package com.thomas.auth_api.services;

import org.springframework.stereotype.Service;

import com.thomas.auth_api.dtos.ExercicesDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.entities.gym.Exercice;
import com.thomas.auth_api.repositories.ExerciceRepository;

@Service
public class ExerciceService {

    private final ExerciceRepository exerciceRepository;


    public ExerciceService(ExerciceRepository exerciceRepository) {
        this.exerciceRepository = exerciceRepository;
      
    }

    public ExercicesDto getExerciceByMaxWeight(String param, User currentUser) {
       
        Exercice exercice = exerciceRepository.findTopByExerciceType_NameAndSeance_UserOrderByWeightDesc(param, currentUser);
        if (exercice == null) {
            throw new RuntimeException("Aucun exercice trouvé pour : " + param);
        }

        return new ExercicesDto(exercice.getId(), exercice.getExerciceType().getName(),
                exercice.getSets(), exercice.getRepetitions(), exercice.getWeight(), exercice.getRestTime());

    }

}
