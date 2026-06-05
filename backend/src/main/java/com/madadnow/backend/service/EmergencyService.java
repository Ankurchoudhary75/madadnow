package com.madadnow.backend.service;

import com.madadnow.backend.dto.*;
import com.madadnow.backend.model.*;
import com.madadnow.backend.repository.*;
import com.madadnow.backend.utils.RateLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmergencyService {

    private static final Logger logger = LoggerFactory.getLogger(EmergencyService.class);

    private final EmergencyRepository emergencyRepository;
    private final TenantRepository tenantRepository;
    private final ShelterService shelterService;

    public EmergencyService(EmergencyRepository emergencyRepository,
            TenantRepository tenantRepository,
            ShelterService shelterService) {
        this.emergencyRepository = emergencyRepository;
        this.tenantRepository = tenantRepository;
        this.shelterService = shelterService;
    }

    public EmergencyResponseDTO handleEmergency(EmergencyRequestDTO dto) {

        String key = dto.getTenantId().toString();

        // 🚨 RATE LIMIT
        if (!RateLimiter.allowRequest(key)) {
            logger.warn("Rate limit exceeded for tenant: {}", dto.getTenantId());
            throw new RuntimeException("Too many requests. Please try again later.");
        }

        logger.info("Emergency triggered for tenant: {}", dto.getTenantId());

        Tenant tenant = tenantRepository.findById(dto.getTenantId())
                .orElseThrow(() -> {
                    logger.error("Tenant not found: {}", dto.getTenantId());
                    return new RuntimeException("Tenant not found");
                });

        // 💾 Save emergency
        EmergencyRequest request = new EmergencyRequest();
        request.setLatitude(dto.getLatitude());
        request.setLongitude(dto.getLongitude());
        request.setCreatedAt(LocalDateTime.now());
        request.setTenant(tenant);

        emergencyRepository.save(request);

        logger.info("Emergency stored in DB for tenant: {}", dto.getTenantId());

        // 🔥 GET JSON STRING FROM CACHE METHOD
        String sheltersJson = shelterService.findNearestShelters(
                dto.getTenantId(),
                dto.getLatitude(),
                dto.getLongitude());

        logger.info("Returning shelters for tenant: {}", dto.getTenantId());

        return new EmergencyResponseDTO(
                "Emergency request received",
                sheltersJson);
    }
}