package com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Estudiante;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    // meotodo personalizado para buscar un estudiante en especifico
    Estudiante findByCodigo(String codigo);

    // metodo personalizado para buscar una lista de estudiantes
    List<Estudiante> findByProgramaId(String programaId);


    
}
