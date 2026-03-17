package com.thomas.auth_api.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thomas.auth_api.dtos.ExercicesDto;
import com.thomas.auth_api.dtos.WeightByDateDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.services.ExerciceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Exercices", description = "Gestion des exercices")
@RequestMapping("/exercices")
@RestController
public class ExerciceController {

    @Schema(description = "Service de gestion des exercices")
    private final ExerciceService exerciceService;

    public ExerciceController(ExerciceService exerciceService) {
        this.exerciceService = exerciceService;
    }

    @Operation(summary = "Récupérer l'exercice avec le poids maximum pour un exercice donné",
            description = "Permet à un utilisateur authentifié de récupérer l'exercice avec le poids maximum pour un exercice donné."
    )
    @GetMapping("/maxByWeight")
    @PreAuthorize("isAuthenticated()")
    public ExercicesDto getMaxByWeight(
        @Parameter(
        name = "param", 
        description = "Le nom de l'exercice pour lequel on cherche le record de poids", 
        example = "Squat", 
        required = true
        )
    @RequestParam String param, @AuthenticationPrincipal User currentUser) {

        ExercicesDto dto = exerciceService.getExerciceByMaxWeight(param, currentUser);

        return dto;
    }

    @Operation(summary = "Récupérer les noms des exercices d'un utilisateur",
            description = "Permet à un utilisateur authentifié de récupérer la liste des noms des exercices qu'il a effectués."
    )
    @GetMapping("getExerciceNames")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getExerciceNames(@AuthenticationPrincipal User currentUser) {

        return ResponseEntity.ok(exerciceService.getExerciceNamesByUser(currentUser));
    }

    @Operation(summary = "Récupérer le poids total soulevé par exercice au fil du temps",
            description = "Permet à un utilisateur authentifié de récupérer le poids total soulevé pour un exercice donné au fil du temps."
    )
    @GetMapping("/weightByTime")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WeightByDateDto>> getWeightByTime(
        @Parameter(
            name = "param",
            description = "Le nom de l'exercice pour lequel on cherche le poids total soulevé",
            example = "Squat",
            required = true
        )
        @RequestParam String param, @AuthenticationPrincipal User currentUser) {
        List<WeightByDateDto> data = exerciceService.getWeightByTime(param, currentUser);
        return ResponseEntity.ok(data);
    }

    @Operation(summary = "Récupérer le nombre total de répétitions pour une semaine donnée",
            description = "Permet à un utilisateur authentifié de récupérer le nombre total de répétitions effectuées pour tous les exercices au cours d'une semaine donnée."
    )
    @GetMapping("/totalRepetitionsForWeek")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getTotalRepetitionsForWeek(
        @Parameter(
            name = "startDate",
            description = "La date de début de la semaine au format ISO (YYYY-MM-DD)",
            example = "2024-01-01",
            required = true
        )
        @RequestParam String startDate,
        @Parameter(
            name = "endDate",
            description = "La date de fin de la semaine au format ISO (YYYY-MM-DD)",
            example = "2024-01-07",
            required = true
        )
        @RequestParam String endDate,
        @AuthenticationPrincipal User currentUser) {

        Integer totalRepetitions = exerciceService.getTotalRepetitionsForWeek(currentUser,
               LocalDate.parse(startDate), LocalDate.parse(endDate));

        return ResponseEntity.ok(totalRepetitions);
    }

    @Operation(summary = "Récupérer le nombre total de répétitions pour un mois donné et un exercice donné",
            description = "Permet à un utilisateur authentifié de récupérer le nombre total de répétitions effectuées pour un exercice donné au cours d'un mois donné."
    )
    @GetMapping("/totalRepetitionsForMonthByName")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getTotalRepetitionsForMonthByName(
        @AuthenticationPrincipal User currentUser,
        @Parameter(
            name = "exerciceName",
            description = "Le nom de l'exercice pour lequel on cherche le nombre total de répétitions",
            example = "Squat",
            required = true
        )
        @RequestParam String exerciceName,
        @Parameter(
            name = "startDate",
            description = "La date de début du mois au format ISO (YYYY-MM-DD)",
            example = "2024-01-01",
            required = true
        )
        @RequestParam String startDate,
        @Parameter(
            name = "endDate",
            description = "La date de fin du mois au format ISO (YYYY-MM-DD)",
            example = "2024-01-31",
            required = true
        )
        @RequestParam String endDate) {

        Integer totalRepetitions = exerciceService.getTotalRepetitionsForMonthByName(currentUser, exerciceName,
                LocalDate.parse(startDate), LocalDate.parse(endDate));

        return ResponseEntity.ok(totalRepetitions);
    }

    @Operation(summary = "Récupérer tous les exercices d'un utilisateur ordonnés par date décroissante",
            description = "Permet à un utilisateur authentifié de récupérer la liste de tous les exercices qu'il a effectués, ordonnés par date décroissante."
    )
    @GetMapping("/allByDateDesc")
    @PreAuthorize("isAuthenticated()")  
    public ResponseEntity<List<ExercicesDto>> getAllExercicesByUserOrderedByDateDesc(@AuthenticationPrincipal User currentUser) {

        List<ExercicesDto> exercices = exerciceService.getAllExercicesByUserOrderedByDateDesc(currentUser);

        return ResponseEntity.ok(exercices);
    }

    @Operation(summary = "Récupérer le poids total soulevé pour une année donnée",
            description = "Permet à un utilisateur authentifié de récupérer le poids total soulevé pour tous les exercices au cours d'une année donnée."
    )
    @GetMapping("/totalWeightForYear")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getTotalWeightForYear(
        @AuthenticationPrincipal User currentUser,
        @Parameter(
            name = "year",
            description = "L'année pour laquelle on cherche le poids total soulevé",
            example = "2024",   
            required = true
        )
            @RequestParam Integer year) {

        Integer totalWeight = exerciceService.getTotalWeightForYear(currentUser, year);

        return ResponseEntity.ok(totalWeight);
    }

    @Operation(summary = "Récupérer le poids total soulevé pour un mois donné",
            description = "Permet à un utilisateur authentifié de récupérer le poids total soulevé pour tous les exercices au cours d'un mois donné."
    )
    @GetMapping("/totalWeightForMonth")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getTotalWeightForMonth(
        @AuthenticationPrincipal User currentUser,
        @Parameter(
            name = "month",
            description = "Le mois pour lequel on cherche le poids total soulevé",
            example = "1",
            required = true
        )
        @RequestParam Integer month,
        @Parameter(
            name = "year",
            description = "L'année pour laquelle on cherche le poids total soulevé",
            example = "2024",
            required = true
        )
        @RequestParam Integer year) {

        Integer totalWeight = exerciceService.getTotalWeightForMonth(currentUser, month, year);

        return ResponseEntity.ok(totalWeight);
    }

}
