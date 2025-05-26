package com.systempaymentsunisalle.sistema_pagos_backend_unisalle;

//import java.util.Random;
//import java.util.UUID;

//import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.Bean;

//import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Estudiante;
//import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Pago;
//import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.PagoStatus;
//import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.TypePago;
//import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.EstudianteRepository;
//import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.PagoRepository;

@SpringBootApplication
public class SistemaPagosBackendUnisalleApplication {

	public static void main(String[] args) {
		SpringApplication.run(SistemaPagosBackendUnisalleApplication.class, args);
	}


	// @Bean
	// CommandLineRunner commandLineRunner(EstudianteRepository estudianteRepository, PagoRepository pagoRepository) {
	// 	return args -> {
	// 		// La inicialización de datos está temporalmente deshabilitada
	// 	};
	// }

}
