package com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity


public class Estudiante {
    
    @Id
    private Long id;
    //private String id;
    private String nombre;
    private String apellido;

    // indica que una columna 'código' no puede tener valores duplicados
    @Column(unique = true)
    private String codigo;

    // identidficador de la carrera a la que pertenece el estudiante
    private String programaId;
    private String foto;

    
}
