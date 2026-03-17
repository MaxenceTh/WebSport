package com.thomas.auth_api.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thomas.auth_api.dtos.SeanceUserDto;
import com.thomas.auth_api.dtos.SeanceWithExercicesDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.entities.gym.Seance;
import com.thomas.auth_api.services.SeanceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/seances")
@RestController
@Tag(name = "Séances", description = "Gestion des séances d'entraînement")
public class SeanceController {
    @Schema(description = "Service de gestion des séances d'entraînement")
    private final SeanceService seanceService;

    public SeanceController(SeanceService seanceService) {
        this.seanceService = seanceService;
    }

    @Operation(
        summary = "Créer une nouvelle séance",
        description = "Permet à un utilisateur authentifié de créer une séance. L'ID de l'utilisateur est récupéré via le token JWT."
    )
    @SecurityRequirement(name = "bearer-key") // Indique qu'il faut un jeton JWT (si configuré)
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public String postMethodName(@RequestBody SeanceUserDto seanceUserDto, @AuthenticationPrincipal User currentUser) {
        Seance entity = seanceService.createSeance(seanceUserDto, currentUser.getId());
        return entity.getName();
    }

    @DeleteMapping("/delete/{id}")
    @Operation(
        summary = "Supprimer une séance",
        description = "Permet à un utilisateur authentifié de supprimer une séance qu'il a créée."
    )
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<String> deleteSeance(@PathVariable Integer id, @AuthenticationPrincipal User currentUser) {

        seanceService.deleteSeance(id, currentUser.getId());

        return ResponseEntity.ok("Séance supprimée avec succès ✅");
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Obtenir les détails d'une séance",
        description = "Permet à un utilisateur authentifié de voir les détails d'une séance qu'il a créée."
    )
    @SecurityRequirement(name = "bearer-key")

    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SeanceWithExercicesDto>> getSeance(
            @PathVariable Integer id,
            @AuthenticationPrincipal User currentUser) {

        List<SeanceWithExercicesDto> dtos = seanceService.getSeances(id, currentUser);
        return ResponseEntity.ok(dtos);

    }
    
    @GetMapping("/allSeance")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Obtenir toutes les séances",
        description = "Permet à un utilisateur authentifié de voir toutes les séances qu'il a créées."
    )
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<List<SeanceWithExercicesDto>> getAllSeance(@AuthenticationPrincipal User currentUser) {

        List<SeanceWithExercicesDto> dtos = seanceService.getAllSeances(currentUser);
        return ResponseEntity.ok(dtos);

    }

    @GetMapping("/oneSeancesForAdmin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(
        summary = "Obtenir les détails des séances pour un administrateur",
        description = "Permet à un administrateur de voir les détails de toutes les séances."
    )
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<List<SeanceWithExercicesDto>> getAllSeancesForAdmin(@RequestParam Integer id) {

        List<SeanceWithExercicesDto> dtos = seanceService.getSeancesForAdmin(id);
        return ResponseEntity.ok(dtos);

    }



}
