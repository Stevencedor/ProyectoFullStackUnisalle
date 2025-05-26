package com.systempaymentsunisalle.sistema_pagos_backend_unisalle.web;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.PagoStatus;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Estudiante;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Pago;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.TypePago;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.EstudianteRepository;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.PagoRepository;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.services.PagoService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin(origins = "*")

public class PagoController {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private PagoService pagoService;

    //metodo que devuelve la lista de estudiantes
    @GetMapping("/estudiantes")
    public List<Estudiante> listarEstudiantes() {
        return estudianteRepository.findAll();
    }

    //meotod que devuelve un estudiante especifico según su código
    @GetMapping("/estudiantes/{codigo}")
    public Estudiante listarEstudiante(@PathVariable String codigo) {
        return estudianteRepository.findByCodigo(codigo);
    }

    //metodo que liste los estudiantes segun el programa academico
    @GetMapping("/estudiantesPorPrograma")
    public List<Estudiante> listarEstudiantesPorPrograma(@RequestParam String programaId) {
        return estudianteRepository.findByProgramaId(programaId);
    }

    
    
    //meotods para el manejo de pagos
    
    //meotodo que devuelva una lista con todos los pagos regidstrados
    @GetMapping("/pagos")
    public List<Pago> listarPagos() {
        return pagoRepository.findAll();
    }

    //metodo que liste los pagos hechos por un estudiante según su código
    @GetMapping("/Estudiantes/{codigo}/pagos")	
    public List<Pago> listarPagosPorCodigoDeEstudiante(@PathVariable String codigo) {
        return pagoRepository.findByEstudianteCodigo(codigo);
    }

    //metodo que liste los pagos según su estado
    @GetMapping("/pagosPorStatus")
    public List<Pago> listarPagosPorStatus(@RequestParam PagoStatus status) {
        return pagoRepository.findByStatus(status);
    }

    //metodo para actualizar el estado de un pago
    @PostMapping("/pagos/{id}/status")
    public Pago actualizarPagoStatus(@PathVariable Long id, @RequestParam PagoStatus status) {
        return pagoService.actualizarPagoPorStatus(status, id);
    }

    //metodo que liste los pagos según su tipo
    @GetMapping("/pagosPorTipo")
    public List<Pago> listarPagosPorTipo(@RequestParam TypePago type) {
        return pagoRepository.findByTipoPago(type);
    }

    //metodo para actualizar el estado de un pago
    //metodo para registrar un pago con archivo adjunto(un comprobante)
    @PostMapping(path = "/pagos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Pago guardarPago(
        @RequestParam("file") MultipartFile file, //archivo adjunto
        double cantidad,
        TypePago type,
        LocalDate date,
        String codigoEstudiante
    ) throws IOException {
        return pagoService.savePago(file, cantidad, type, date, codigoEstudiante); //guardar el pago en la base de datos
    }

    //meotodo para descargar el archivo de un pago
    @GetMapping(value = "/pagoFile/{pagoId}", produces = MediaType.APPLICATION_PDF_VALUE)
    public byte[] listarArchivoPorId(@PathVariable Long pagoId) throws IOException {
        return pagoService.getArchivoPorId(pagoId); // obtiene el archivo del pago en formato binario
    }

}
