package com.madadnow.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.madadnow.backend.dto.TenantRequestDTO;
import com.madadnow.backend.dto.TenantResponseDTO;
import com.madadnow.backend.model.Tenant;
import com.madadnow.backend.repository.TenantRepository;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    // GET
    public List<TenantResponseDTO> getAllTenants() {
        return tenantRepository.findAll()
                .stream()
                .map(t -> new TenantResponseDTO(t.getId(), t.getName(), t.getEmail()))
                .collect(Collectors.toList());
    }

    // POST
    public TenantResponseDTO createTenant(TenantRequestDTO dto) {

        Tenant tenant = new Tenant();
        tenant.setName(dto.getName());
        tenant.setEmail(dto.getEmail());

        Tenant saved = tenantRepository.save(tenant);

        return new TenantResponseDTO(saved.getId(), saved.getName(), saved.getEmail());
    }
}