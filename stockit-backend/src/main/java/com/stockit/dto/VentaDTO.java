package com.stockit.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.stockit.model.DetalleVenta;
import com.stockit.model.Usuario;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VentaDTO {
    private Long id;
    private Double total;
    private LocalDateTime fecha;
    private Usuario usuario;
    private List<DetalleVenta> detalles;
    private ClienteDTO cliente;

    @Getter
    @Setter
    public static class ClienteDTO {
        private String nombre;
        private String cif;
        private String direccion;
        private String telefono;
    }
}