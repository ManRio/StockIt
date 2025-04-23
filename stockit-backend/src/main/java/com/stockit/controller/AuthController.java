package com.stockit.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockit.dto.LoginRequest;
import com.stockit.jwt.JwtTokenProvider;
import com.stockit.model.Usuario;
import com.stockit.repository.UsuarioRepository;
import com.stockit.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UsuarioService usuarioService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtTokenProvider jwtTokenProvider;
    @Autowired private UsuarioRepository usuarioRepository;

    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> request) {
        String nombre = request.get("nombre");
        String email = request.get("email");
        String password = request.get("password");
        String rolStr = request.get("rol");

        Usuario.Rol rol;
        try {
            rol = Usuario.Rol.valueOf(rolStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return "Rol inválido. Usa ADMIN o EMPLEADO.";
        }

        usuarioService.registrarUsuario(nombre, email, password, rol);
        return "Usuario registrado correctamente";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }

            Usuario usuario = usuarioOpt.get();
            String token = jwtTokenProvider.generateToken(usuario);

            return ResponseEntity.ok().body(
            new AuthResponse(token, usuario.getRol().name(), usuario.getId(), usuario.getNombre())
        );


        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }

    public record AuthResponse(String token, String rol, Long id, String nombre) {}
}