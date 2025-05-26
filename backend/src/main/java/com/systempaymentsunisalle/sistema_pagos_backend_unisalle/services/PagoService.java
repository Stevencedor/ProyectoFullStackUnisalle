package com.systempaymentsunisalle.sistema_pagos_backend_unisalle.services;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Estudiante;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Pago;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.PagoStatus;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.TypePago;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.EstudianteRepository;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.PagoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PagoService {
    
    @Autowired
    private	PagoRepository pagoRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;
    
    /**
     * @param file archivo PDF que se subirá al servidor
     * @param cantidad monto del pago realizado
     * @param type tipo de pago realizado (REALIZADO, PENDIENTE, etc)
     * @param fecha fecha en la que se realizó el pago
     * @param codigoEstudiante código del estudiante que realizó el pago
     * @return Objeto del pago guardado en la base de datos
     * @throws IOException lanzar si ocurre un error al manejar el archivo
     *  
     */

    public Pago savePago(MultipartFile file, double cantidad, TypePago type, LocalDate date, String codigoEstudiante) throws IOException {

        //construir la ruta donde se guardará el archivo dentro del sistema
        Path folderPath = Paths.get(System.getProperty("user.home"), "enset-data","pagos");
        if (!Files.exists(folderPath))  {
            Files.createDirectories(folderPath);
        }

        //generar un nombre único para el archivo usando UUID(identficador único universal)
        String fileName = UUID.randomUUID().toString();

        //construir la ruta completa del archivo, añadiendo la extensión
        Path filePath = Paths.get(System.getProperty("user.home"), "enset-data", "pagos", fileName + ".pdf");

        //guardar el archivo en la ubicación especificada dentro del sistema de archivos
        Files.copy(file.getInputStream(), filePath);

        //buscar en la base de datos el estudiante que realizo el pago, usando el código unico de sistema UUID
        Estudiante estudiante = estudianteRepository.findByCodigo(codigoEstudiante);

        //crear un nuevo objeto pago utilizando el patron de diseño builder
        Pago pago = Pago.builder()

            .tipoPago(type) //tipo de pago realizado
            .status(PagoStatus.CREADO) //estado inicial del pago
            .fecha(date) //fecha en la que se realizó el pago
            .estudiante(estudiante) //estudiante que realizó el pago
            .cantidad(cantidad) //monto del pago realizado
            .file(filePath.toUri().toString()) //ruta del archivo PDF almacenado en el sistema
            .build(); //construir el objeto pago

        return pagoRepository.save(pago); //guardar el pago en la base de datos             
    
    }

    public byte[] getArchivoPorId(Long pagoId) throws IOException {
        
        //buscar el pago en la base de datos usando el identificador único
        Pago pago = pagoRepository.findById(pagoId).get();
        return Files.readAllBytes(Path.of(URI.create(pago.getFile())));

    }

    public Pago actualizarPagoPorStatus(PagoStatus status, Long id) {

        //buscar un objeto en la base de dattos por su id
        Pago pago = pagoRepository.findById(id).get();

        //actualizar el estado del pago con el nuevo estado recibido
        pago.setStatus(status);

        return pagoRepository.save(pago);

    }

}

