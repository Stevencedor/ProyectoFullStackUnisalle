package com.systempaymentsunisalle.sistema_pagos_backend_unisalle.dtos;

import java.time.LocalDate;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.TypePago;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class NewPagoDto {

    private double cantidad;
    private TypePago typePago;
    private LocalDate fecha;
    private String codigoEstudiante;

}
