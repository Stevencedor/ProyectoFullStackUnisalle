package com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.PagoStatus;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.TypePago;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Pago {
    
    @Id
    //generar el id automáticamente
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //identificador único del pago

    private LocalDate fecha;
    private double cantidad;
    private TypePago tipoPago; 
    private PagoStatus status;
    private String file;
    
    @ManyToOne //muchos pagos pueden estar relacionados a un estudiante
    private Estudiante estudiante;         

}
