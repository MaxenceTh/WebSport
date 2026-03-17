package com.thomas.auth_api.controllers;

import com.thomas.auth_api.dtos.UserDto;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Utilisateurs", description = "Gestion des utilisateurs")
@RequestMapping("/users")
@RestController
public class UserController {
    @Schema(description = "Service de gestion des utilisateurs")
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
        summary = "Récupérer les informations de l'utilisateur authentifié",
        description = "Permet à un utilisateur authentifié de récupérer ses propres informations. L'ID de l'utilisateur est récupéré via le token JWT."
    )
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> authenticatedUser(@AuthenticationPrincipal User currentUser) {
        UserDto dto = new UserDto(
                currentUser.getId(),
                currentUser.getFullName(),
                currentUser.getEmail(),
                currentUser.getRole().getName().name());

        return ResponseEntity.ok(dto);
    }

    @Operation(
        summary = "Récupérer la liste de tous les utilisateurs",
        description = "Permet à un administrateur de récupérer la liste de tous les utilisateurs du système."
    )
    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<UserDto>> allUsers() {
        List<User> users = userService.allUsers();
        List<UserDto> dtoUsers = users.stream().map(user -> new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName().name()
        )).toList();

        return ResponseEntity.ok(dtoUsers);
    }
}