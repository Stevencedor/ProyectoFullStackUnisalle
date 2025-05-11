package com.systempaymentsunisalle.sistema_pagos_backend_unisalle;

import java.time.LocalDate;
import java.util.Random;
//import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Estudiante;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Pago;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.PagoStatus;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.TypePago;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.EstudianteRepository;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository.PagoRepository;

@SpringBootApplication
public class SistemaPagosBackendUnisalleApplication {

	public static void main(String[] args) {
		SpringApplication.run(SistemaPagosBackendUnisalleApplication.class, args);
	}


	@Bean
	CommandLineRunner commandLineRunner(EstudianteRepository estudianteRepository, PagoRepository pagoRepository) {
		return args -> {
			//guardar un estudiante en la base de datos al iniciar la aplicación
			estudianteRepository.save(Estudiante.builder()
			//.id(UUID.randomUUID().toString())
			.id(Math.abs(new Random().nextLong()))
			.nombre("Melissa")
			.apellido("Gordillo")
			.codigo("12345")
			.programaId("IS2025")
			.build());

			estudianteRepository.save(Estudiante.builder()
			//.id(UUID.randomUUID().toString())
			.id(Math.abs(new Random().nextLong()))
			.nombre("Xiomara")
			.apellido("Posada")
			.codigo("78912")
			.programaId("II2024")
			.build());

			//obtiene todos los valores posibles del enumerador TypePago
			TypePago tiposPago[] = TypePago.values();
			//cree un objeto random para seleccionar datos aleatorios
			Random random = new Random();

			estudianteRepository.findAll().forEach(estudiante -> {
				
				for (int i = 0; i < 10; i++) {
					//genere un indice aleatorio para seleccionar un tipo pago
					int index = random.nextInt(tiposPago.length);

					//contruir un objeto con pagos con valores aleatorios
					Pago pago = Pago.builder()
					.cantidad(1000 +  (int) (Math.random() * 20000))
					.tipoPago(tiposPago[index])
					.status(PagoStatus.CREADO) // estado inicial del pago es creado
					.fecha(LocalDate.now())
					.estudiante(estudiante)
					.build();

					//guardar el pago en la BD					
					pagoRepository.save(pago);
				}
			});
		};
	}

}
