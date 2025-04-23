package com.stockit.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stockit.dto.VentaDTO;
import com.stockit.dto.VentaRequestDTO;
import com.stockit.model.Usuario;
import com.stockit.model.Venta;
import com.stockit.security.UserPrincipal;
import com.stockit.service.VentaService;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    public List<VentaDTO> listar() {
        return ventaService.listarVentasDTO();
    }

    @GetMapping("/{id}")
    public Optional<Venta> obtenerPorId(@PathVariable Long id) {
        return ventaService.obtenerVentaPorId(id);
    }

    @PostMapping
    public ResponseEntity<Venta> crearVenta(@RequestBody VentaRequestDTO dto) {
        Venta venta = ventaService.crearVentaDesdeDTO(dto);
        return ResponseEntity.ok(venta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ventaService.eliminarVenta(id);
    }

    @GetMapping("/por-fecha")
    public List<VentaDTO> listarPorFechas(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ventaService.buscarPorRangoFechaDTO(inicio, fin);
    }

    @GetMapping("/reporte-mensual")
    public ResponseEntity<List<VentaDTO>> obtenerReporteMensual(@AuthenticationPrincipal UserPrincipal principal) {
        Usuario usuario = principal.getUsuario();

        if (!"ADMIN".equalsIgnoreCase(usuario.getRol().toString())) {
            return ResponseEntity.status(403).build();
        }

        List<Venta> ventas = ventaService.obtenerVentasDelMesActual(usuario);
        List<VentaDTO> ventasDTO = ventas.stream().map(v -> {
            VentaDTO dto = new VentaDTO();
            dto.setId(v.getId());
            dto.setFecha(v.getFecha());
            dto.setTotal(v.getTotal());
            dto.setUsuario(v.getUsuario());
            dto.setDetalles(v.getDetalles());

            VentaDTO.ClienteDTO cliente = new VentaDTO.ClienteDTO();
            cliente.setNombre(v.getClienteNombre());
            cliente.setCif(v.getClienteCif());
            cliente.setDireccion(v.getClienteDireccion());
            cliente.setTelefono(v.getClienteTelefono());
            dto.setCliente(cliente);

            return dto;
        }).toList();

        return ResponseEntity.ok(ventasDTO);
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<VentaDTO>> obtenerPorUsuario(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (!principal.getUsuario().getId().equals(id)
                && !"ADMIN".equalsIgnoreCase(principal.getUsuario().getRol().toString())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(ventaService.obtenerVentasPorUsuarioDTO(id));
    }

    @GetMapping("/usuario/{id}/por-fecha")
    public ResponseEntity<List<VentaDTO>> obtenerPorUsuarioYFecha(
            @PathVariable Long id,
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (!principal.getUsuario().getId().equals(id)
                && !"ADMIN".equalsIgnoreCase(principal.getUsuario().getRol().toString())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ventaService.buscarPorUsuarioYRangoFechaDTO(id, inicio, fin));
    }

    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<?> obtenerProductosMasVendidos() {
        return ResponseEntity.ok(ventaService.obtenerProductosMasVendidos());
    }

    @GetMapping("/ranking-mensual")
    public ResponseEntity<?> rankingMensual() {
        List<Object[]> resultados = ventaService.obtenerRankingMensual();
        List<Map<String, Object>> ranking = resultados.stream().map(obj -> {
            Map<String, Object> m = new HashMap<>();
            m.put("usuario", obj[0]);
            m.put("total", obj[1]);
            return m;
        }).toList();
        return ResponseEntity.ok(ranking);
    }
}
