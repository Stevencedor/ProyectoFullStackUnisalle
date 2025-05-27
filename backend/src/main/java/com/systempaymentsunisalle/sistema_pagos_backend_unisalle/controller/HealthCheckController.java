package main.java.com.systempaymentsunisalle.sistema_pagos_backend_unisalle.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para diagnóstico de la aplicación
 * Proporcionando endpoints básicos para verificar la conexión y el estado del servidor
 */
@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    /**
     * Endpoint simple para verificar que el servidor está respondiendo
     * @return Estado del servidor
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        response.put("message", "Servidor funcionando correctamente");
        
        // Información sobre el servidor
        Map<String, String> server = new HashMap<>();
        server.put("java", System.getProperty("java.version"));
        server.put("os", System.getProperty("os.name") + " " + System.getProperty("os.version"));
        response.put("server", server);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint específico para probar CORS
     * @return Mensaje de éxito
     */
    @GetMapping("/cors-test")
    public ResponseEntity<Map<String, Object>> testCors() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Configuración CORS funcionando correctamente");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
