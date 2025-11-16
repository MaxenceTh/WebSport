package com.thomas.auth_api.services;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.thomas.auth_api.dtos.ExercicesDto;
import com.thomas.auth_api.dtos.WeightByDateDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.entities.gym.Exercice;
import com.thomas.auth_api.repositories.ExerciceRepository;
import com.thomas.auth_api.repositories.UserRepository;

@Service
public class ExerciceService {

    private final ExerciceRepository exerciceRepository;
    private final UserRepository userRepository;

    public ExerciceService(ExerciceRepository exerciceRepository, UserRepository userRepository) {
        this.exerciceRepository = exerciceRepository;
        this.userRepository = userRepository;

    }

    public ExercicesDto getExerciceByMaxWeight(String param, User currentUser) {

        Exercice exercice = exerciceRepository.findTopByExerciceType_NameAndSeance_UserOrderByWeightDesc(param,
                currentUser);
        if (exercice == null) {
            throw new RuntimeException("Aucun exercice trouvé pour : " + param);
        }

        return new ExercicesDto(exercice.getId(), exercice.getExerciceType().getName(),
                exercice.getSets(), exercice.getRepetitions(), exercice.getWeight(), exercice.getRestTime(),
                exercice.getCreatedAt().toString());

    }

    public List<String> getExerciceNamesByUser(User user) {
        return exerciceRepository.findDistinctExerciceTypeNamesByUser(user);
    }

    public List<WeightByDateDto> getWeightByTime(String exerciceName, User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Object[]> results = exerciceRepository.findWeightsByExerciceAndUser(exerciceName, user);

        return results.stream()
                .map(r -> new WeightByDateDto((Integer) r[0], (Date) r[1]))
                .collect(Collectors.toList());
    }

    public Integer getTotalRepetitionsForWeek(User currentUser, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return exerciceRepository.countTotalRepetitionOfWeek(user, startDate, endDate);
    }

    public Integer getTotalRepetitionsForMonthByName(User currentUser, String exerciceName, LocalDate startDate,
            LocalDate endDate) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return exerciceRepository.countTotalRepetitionOfMonthByName(user, exerciceName, startDate, endDate);
    }

    public List<ExercicesDto> getAllExercicesByUserOrderedByDateDesc(User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Exercice> exercices = exerciceRepository.findAllExercicesByOrderByCreatedAtDesc(user);

        return exercices.stream()
                .map(exercice -> new ExercicesDto(
                        exercice.getId(),
                        exercice.getExerciceType().getName(),
                        exercice.getSets(),
                        exercice.getRepetitions(),
                        exercice.getWeight(),
                        exercice.getRestTime(),
                        exercice.getCreatedAt().toString()))
                .collect(Collectors.toList());
    }

    public Integer getTotalWeightForYear(User currentUser, Integer year) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return exerciceRepository.countTotalWeightOfYear(user, year);
    }

    public Integer getTotalWeightForMonth(User currentUser, Integer month, Integer year) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return exerciceRepository.countTotalWeightOfMonth(user, month, year);
    }

}
