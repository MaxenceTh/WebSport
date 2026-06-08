package com.thomas.auth_api.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thomas.auth_api.dtos.LoginUserDto;
import com.thomas.auth_api.dtos.RegisterUserDto;
import com.thomas.auth_api.entities.RoleEnum;
import com.thomas.auth_api.entities.User;
import com.thomas.auth_api.services.AuthenticationService;
import com.thomas.auth_api.services.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebMvcTest(AuthenticationController.class)
@AutoConfigureMockMvc(addFilters = false) // Désactive Spring Security pour tester uniquement la logique du contrôleur
public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationService authenticationService;

    @MockitoBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Inscription : Devrait retourner l'utilisateur créé avec un status 200")
    void registerUserTest() throws Exception {

        com.thomas.auth_api.entities.Role mockRole = new com.thomas.auth_api.entities.Role();
        mockRole.setName(RoleEnum.USER);

        // GIVEN (Préparation des données)
        RegisterUserDto registerDto = new RegisterUserDto();
        registerDto.setEmail("thomas@test.com");
        registerDto.setPassword("password123");
        registerDto.setFullName("Thomas Dev");

        User mockUser = new User();
        mockUser.setEmail("thomas@test.com");
        mockUser.setFullName("Thomas Dev");
        mockUser.setRole(mockRole);

        // WHEN & THEN (Exécution et Vérification)
        when(authenticationService.signup(any(RegisterUserDto.class))).thenReturn(mockUser);
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("thomas@test.com"))
                .andExpect(jsonPath("$.fullName").value("Thomas Dev"));
    }

    @Test
    @DisplayName("Connexion : Devrait retourner un token JWT et un temps d'expiration")
    void authenticateUserTest() throws Exception {
        // GIVEN
        LoginUserDto loginDto = new LoginUserDto();
        loginDto.setEmail("thomas@test.com");
        loginDto.setPassword("password123");

        User authenticatedUser = new User();
        authenticatedUser.setEmail("thomas@test.com");

        String fakeToken = "mocked-jwt-token-xyz";
        long expirationTime = 3600000;

        // WHEN & THEN
        when(authenticationService.authenticate(any(LoginUserDto.class))).thenReturn(authenticatedUser);
        when(jwtService.generateToken(any(User.class))).thenReturn(fakeToken);
        when(jwtService.getExpirationTime()).thenReturn(expirationTime);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(fakeToken))
                .andExpect(jsonPath("$.expiresIn").value(expirationTime));
    }
}