package com.thomas.auth_api.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thomas.auth_api.configs.SecurityConfiguration;
import com.thomas.auth_api.dtos.SeanceUserDto;
import com.thomas.auth_api.entities.RoleEnum;
import com.thomas.auth_api.entities.gym.Seance;
import com.thomas.auth_api.services.SeanceService;
import com.thomas.auth_api.services.JwtService;

@WebMvcTest(SeanceController.class)
@Import(SecurityConfiguration.class)
public class SeanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- MOCKS DES SERVICES ---

    @MockitoBean
    private SeanceService seanceService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private AuthenticationProvider authenticationProvider;

    // Méthode utilitaire pour générer les utilisateurs de test avec différents
    // rôles
    private com.thomas.auth_api.entities.User setupUser(RoleEnum role) {
        com.thomas.auth_api.entities.Role mockRole = new com.thomas.auth_api.entities.Role();
        mockRole.setName(role);

        com.thomas.auth_api.entities.User user = new com.thomas.auth_api.entities.User();
        user.setId(1);
        user.setEmail("test@test.com");
        user.setRole(mockRole);
        return user;
    }

    // --- TESTS DES ENDPOINTS ---

    @Test
    void shouldCreateSeanceSuccessfully() throws Exception {

        var customUser = setupUser(RoleEnum.USER);
        SeanceUserDto dto = new SeanceUserDto();
        dto.setName("Ma Séance Test");
        dto.setExercices(Collections.emptyList());

        Seance mockSeance = new Seance();
        mockSeance.setName("Ma Séance Test");

        when(seanceService.createSeance(any(SeanceUserDto.class), any())).thenReturn(mockSeance);

        mockMvc.perform(post("/seances/create")
                .with(csrf())
                .with(user(customUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Ma Séance Test"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldGetAllSeances() throws Exception {
        // On simule une liste vide retournée par le service
        when(seanceService.getAllSeances(any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/seances/allSeance"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "SUPER_ADMIN" })
    void shouldAllowAdminToAccessSpecialRoute() throws Exception {
        when(seanceService.getSeancesForAdmin(anyInt())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/seances/oneSeancesForAdmin")
                .param("id", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldFailWhenNotAuthenticated() throws Exception {
        // Ici on ne met PAS @WithMockUser pour tester le refus d'accès
        mockMvc.perform(get("/seances/allSeance"))
                .andExpect(status().isForbidden()); // On attend un 403 car l'utilisateur n'est pas authentifié
    }

    @Test
    void shouldFailWhenUserIsAnAdminRoute() throws Exception {
        mockMvc.perform(get("/seances/oneSeancesForAdmin")
                .param("id", "2")
                .with(user("test").roles("USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldDeleteSeanceSuccessfullyWithCustomUser() throws Exception {
        var customUser = setupUser(RoleEnum.USER);

        mockMvc.perform(delete("/seances/delete/1")
                .with(csrf())
                .with(user(customUser)))
                .andExpect(status().isOk())
                .andExpect(content().string("Séance supprimée avec succès"));
    }
}