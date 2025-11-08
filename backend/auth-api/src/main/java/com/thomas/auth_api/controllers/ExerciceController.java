package com.thomas.auth_api.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thomas.auth_api.dtos.ExercicesDto;
import com.thomas.auth_api.dtos.WeightByDateDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.services.ExerciceService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequestMapping("/exercices")
@RestController
public class ExerciceController {

    private final ExerciceService exerciceService;

    public ExerciceController(ExerciceService exerciceService) {
        this.exerciceService = exerciceService;
    }

    @GetMapping("/maxByWeight")
    @PreAuthorize("isAuthenticated()")
    public ExercicesDto getMaxByWeight(@RequestParam String param, @AuthenticationPrincipal User currentUser) {

        ExercicesDto dto = exerciceService.getExerciceByMaxWeight(param, currentUser);

        return dto;
    }

    @GetMapping("getExerciceNames")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getExerciceNames(@AuthenticationPrincipal User currentUser) {

        return ResponseEntity.ok(exerciceService.getExerciceNamesByUser(currentUser));
    }

    @GetMapping("/weightByTime")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WeightByDateDto>> getWeightByTime(@RequestParam String param,
            @AuthenticationPrincipal User currentUser) {
        List<WeightByDateDto> data = exerciceService.getWeightByTime(param, currentUser);
        return ResponseEntity.ok(data);
    }

}
