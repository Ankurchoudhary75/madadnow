package com.madadnow.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.madadnow.backend.dto.TenantRequestDTO;
import com.madadnow.backend.dto.TenantResponseDTO;
import com.madadnow.backend.service.TenantService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    public List<TenantResponseDTO> getTenants() {
        return tenantService.getAllTenants();
    }

    @PostMapping
    public TenantResponseDTO createTenant(@Valid @RequestBody TenantRequestDTO dto) {
        return tenantService.createTenant(dto);
    }
}