package com.thomas.auth_api.controllers;

import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.dtos.LoginUserDto;
import com.thomas.auth_api.dtos.RegisterUserDto;
import com.thomas.auth_api.responses.LoginResponse;
import com.thomas.auth_api.services.AuthenticationService;
import com.thomas.auth_api.services.JwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication", description = "Gestion de l'authentification des utilisateurs")
@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    @Schema(description = "Service de gestion de l'authentification")
    private final JwtService jwtService;

    @Schema(description = "Service de gestion des utilisateurs")
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @Operation(summary = "Enregistrer un nouvel utilisateur", description = "Permet de créer un compte utilisateur en fournissant les informations nécessaires.")
    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @Operation(summary = "Authentifier un utilisateur", description = "Permet à un utilisateur de se connecter en fournissant ses identifiants. Retourne un token JWT en cas de succès.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
}