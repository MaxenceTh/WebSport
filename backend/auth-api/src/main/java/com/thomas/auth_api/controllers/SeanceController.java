package com.thomas.auth_api.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thomas.auth_api.dtos.SeanceUserDto;
import com.thomas.auth_api.dtos.SeanceWithExercicesDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.entities.gym.Seance;
import com.thomas.auth_api.services.SeanceService;

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
public class SeanceController {
    private final SeanceService seanceService;

    public SeanceController(SeanceService seanceService) {
        this.seanceService = seanceService;
    }

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public String postMethodName(@RequestBody SeanceUserDto seanceUserDto, @AuthenticationPrincipal User currentUser) {
        // TODO: process POST request

        Seance entity = seanceService.createSeance(seanceUserDto, currentUser.getId());

        return entity.getName();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSeance(@PathVariable Integer id, @AuthenticationPrincipal User currentUser) {

        seanceService.deleteSeance(id, currentUser.getId());

        return ResponseEntity.ok("Séance supprimée avec succès ✅");
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SeanceWithExercicesDto>> getSeance(
            @PathVariable Integer id,
            @AuthenticationPrincipal User currentUser) {

        List<SeanceWithExercicesDto> dtos = seanceService.getSeances(id, currentUser);
        return ResponseEntity.ok(dtos);

    }

    @GetMapping("/allSeance")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SeanceWithExercicesDto>> getAllSeance(@AuthenticationPrincipal User currentUser) {

        List<SeanceWithExercicesDto> dtos = seanceService.getAllSeances(currentUser);
        return ResponseEntity.ok(dtos);

    }

    @GetMapping("/oneSeancesForAdmin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SeanceWithExercicesDto>> getAllSeancesForAdmin(@RequestParam Integer id) {

        List<SeanceWithExercicesDto> dtos = seanceService.getSeancesForAdmin(id);
        return ResponseEntity.ok(dtos);

    }



}
