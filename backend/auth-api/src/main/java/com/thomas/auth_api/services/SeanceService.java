package com.thomas.auth_api.services;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thomas.auth_api.repositories.UserRepository;
import com.thomas.auth_api.dtos.ExercicesDto;
import com.thomas.auth_api.dtos.SeanceUserDto;
import com.thomas.auth_api.dtos.SeanceWithExercicesDto;
import com.thomas.auth_api.entities.RoleEnum;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.entities.gym.Exercice;
import com.thomas.auth_api.entities.gym.ExerciceType;
import com.thomas.auth_api.entities.gym.Seance;
import com.thomas.auth_api.repositories.ExerciceTypeRepository;
import com.thomas.auth_api.repositories.SeanceRepository;

@Service
public class SeanceService {

    private final SeanceRepository seanceRepository;
    private final UserRepository userRepository;
    private final ExerciceTypeRepository exerciceTypeRepository;

    public SeanceService(SeanceRepository seanceRepository, UserRepository userRepository,
            ExerciceTypeRepository exerciceTypeRepository) {
        this.seanceRepository = seanceRepository;
        this.userRepository = userRepository;
        this.exerciceTypeRepository = exerciceTypeRepository;
    }

    public Seance createSeance(SeanceUserDto seanceUserDto, Integer userId) {

        // 1️⃣ Récupérer l'utilisateur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2️⃣ Créer une nouvelle séance
        Seance seance = new Seance();
        seance.setName(seanceUserDto.getName());
        seance.setUser(user);

        // 3️⃣ Si l’utilisateur est admin → rendre publique
        boolean isAdmin = user.getRole().getName() == RoleEnum.ADMIN;
        seance.setPublic(isAdmin);

        // 3️⃣ Mapper les ExerciceDto → Exercice
        List<Exercice> exercices = seanceUserDto.getExercices().stream().map(exoDto -> {
            ExerciceType type = exerciceTypeRepository.findByName(exoDto.getExerciceTypeName())
                    .orElseGet(() -> {
                        ExerciceType newType = new ExerciceType();
                        newType.setName(exoDto.getExerciceTypeName());
                        return exerciceTypeRepository.save(newType);
                    });

            Exercice exo = new Exercice();
            exo.setExerciceType(type);
            exo.setSets(exoDto.getSets());
            exo.setRepetitions(exoDto.getRepetitions());
            exo.setWeight(exoDto.getWeight());
            exo.setRestTime(exoDto.getRestTime());
            exo.setSeance(seance);

            return exo;
        }).toList();

        // 4️⃣ Ajouter les exercices à la séance
        seance.setExercices(exercices);

        // 5️⃣ Sauvegarder la séance (les exercices seront liés automatiquement)
        return seanceRepository.save(seance);
    }

    public void deleteSeance(Integer seanceId, Integer userId) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));
        if (!seance.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette séance");
        } else {
            seanceRepository.delete(seance);
        }
    }

    @Transactional
    public List<SeanceWithExercicesDto> getSeances(Integer id, User currentUser) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        if (!seance.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Accès refusé à cette séance");
        }

        List<ExercicesDto> exercices = seance.getExercices().stream()
                .map(exo -> new ExercicesDto(
                        exo.getId(),
                        exo.getExerciceType().getName(),
                        exo.getSets(),
                        exo.getRepetitions(),
                        exo.getWeight(),
                        exo.getRestTime()))
                .toList();

        SeanceWithExercicesDto dto = new SeanceWithExercicesDto();
        dto.setId(seance.getId());
        dto.setName(seance.getName());
        dto.setExercices(exercices);

        return List.of(dto);

    }

    @Transactional(readOnly = true)
    public List<SeanceWithExercicesDto> getAllSeances(User currentUser) {

        List<Seance> seances = seanceRepository.findByUserId(currentUser.getId());

        return seances.stream().map(seance -> {
            List<ExercicesDto> exercices = seance.getExercices().stream()
                    .map(exo -> new ExercicesDto(
                            exo.getId(),
                            exo.getExerciceType().getName(),
                            exo.getSets(),
                            exo.getRepetitions(),
                            exo.getWeight(),
                            exo.getRestTime()))
                    .toList();

            SeanceWithExercicesDto dto = new SeanceWithExercicesDto();
            dto.setId(seance.getId());
            dto.setName(seance.getName());
            dto.setExercices(exercices);

            return dto;
        }).toList();

    }

    @Transactional(readOnly = true)
    public List<SeanceWithExercicesDto> getSeancesForAdmin(Integer id) {
        List<Seance> seances = seanceRepository.findByUserId(id);

        return seances.stream().map(seance -> {
            List<ExercicesDto> exercices = seance.getExercices().stream()
                    .map(exo -> new ExercicesDto(
                            exo.getId(),
                            exo.getExerciceType().getName(),
                            exo.getSets(),
                            exo.getRepetitions(),
                            exo.getWeight(),
                            exo.getRestTime()))
                    .toList();

            SeanceWithExercicesDto dto = new SeanceWithExercicesDto();
            dto.setId(seance.getId());
            dto.setName(seance.getName());
            dto.setExercices(exercices);

            return dto;
        }).toList();
    }

}
