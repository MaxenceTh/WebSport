package com.thomas.auth_api.controllers;

import com.thomas.auth_api.dtos.RegisterUserDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Administrateurs", description = "Gestion des administrateurs")
@RequestMapping("/admins")
@RestController
public class AdminController {
    @Schema(description = "Service de gestion des utilisateurs")
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }
    
    @Operation(summary = "Créer un nouvel administrateur", description = "Permet de créer un nouvel administrateur. Seuls les super administrateurs peuvent effectuer cette action.")
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> createAdministrator(@RequestBody RegisterUserDto registerUserDto) {
        User createdAdmin = userService.createAdministrator(registerUserDto);

        return ResponseEntity.ok(createdAdmin);
    }
}
