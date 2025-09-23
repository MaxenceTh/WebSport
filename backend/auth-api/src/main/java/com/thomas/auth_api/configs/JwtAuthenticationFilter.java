package com.thomas.auth_api.configs;

import com.thomas.auth_api.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
        JwtService jwtService,
        UserDetailsService userDetailsService,
        HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Récupération du header Authorization de la requête
        final String authHeader = request.getHeader("Authorization");

         // Si le header est vide ou ne commence pas par "Bearer ", on ignore et on passe au filtre suivant
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extraction du token JWT (on enlève "Bearer ")
            final String jwt = authHeader.substring(7);
            // Extraction du nom d'utilisateur/email du JWT
            final String userEmail = jwtService.extractUsername(jwt);

            // Vérification si une authentification existe déjà dans le contexte
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // Si l’email existe dans le token et qu’aucune authentification n’existe encore
            if (userEmail != null && authentication == null) {
                // On charge les informations utilisateur depuis la DB via UserDetailsService
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                 // On vérifie si le token est valide pour cet utilisateur
                if (jwtService.isTokenValid(jwt, userDetails)) {
                     // On crée un objet Authentication (ici UsernamePasswordAuthenticationToken)             
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // On associe les détails de la requête (IP, session, etc.) à l'authentification    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                     // On place cette authentification dans le contexte de sécurité
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            // On continue le traitement de la requête après avoir éventuellement ajouté l'auth
            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            // Si une exception survient, on la gère via le HandlerExceptionResolver       
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}