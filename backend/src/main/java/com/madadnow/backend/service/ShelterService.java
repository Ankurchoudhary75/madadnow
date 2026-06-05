package com.madadnow.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.madadnow.backend.dto.*;
import com.madadnow.backend.model.*;
import com.madadnow.backend.repository.*;
import com.madadnow.backend.utils.DistanceUtil;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShelterService {

        private final ShelterRepository shelterRepository;
        private final TenantRepository tenantRepository;

        private final ObjectMapper objectMapper = new ObjectMapper();

        public ShelterService(ShelterRepository shelterRepository,
                        TenantRepository tenantRepository) {
                this.shelterRepository = shelterRepository;
                this.tenantRepository = tenantRepository;
        }

        // CREATE
        public ShelterResponseDTO createShelter(ShelterRequestDTO dto) {

                Tenant tenant = tenantRepository.findById(dto.getTenantId())
                                .orElseThrow(() -> new RuntimeException("Tenant not found"));

                Shelter shelter = new Shelter();
                shelter.setName(dto.getName());
                shelter.setLatitude(dto.getLatitude());
                shelter.setLongitude(dto.getLongitude());
                shelter.setCapacity(dto.getCapacity());
                shelter.setTenant(tenant);

                Shelter saved = shelterRepository.save(shelter);

                return new ShelterResponseDTO(
                                saved.getId(),
                                saved.getName(),
                                saved.getLatitude(),
                                saved.getLongitude(),
                                saved.getCapacity());
        }

        // GET by tenant
        public List<ShelterResponseDTO> getSheltersByTenant(Long tenantId) {
                return shelterRepository.findByTenantId(tenantId)
                                .stream()
                                .map(s -> new ShelterResponseDTO(
                                                s.getId(),
                                                s.getName(),
                                                s.getLatitude(),
                                                s.getLongitude(),
                                                s.getCapacity()))
                                .toList();
        }

        // 🔥 REDIS CACHED METHOD (STRING BASED)
        @Cacheable(value = "nearestShelters", key = "#tenantId + '-' + #userLat + '-' + #userLon")
        public String findNearestShelters(
                        Long tenantId,
                        double userLat,
                        double userLon) {

                try {
                        var result = shelterRepository.findByTenantId(tenantId)
                                        .stream()
                                        .sorted((s1, s2) -> {
                                                double d1 = DistanceUtil.calculateDistance(
                                                                userLat, userLon,
                                                                s1.getLatitude(), s1.getLongitude());

                                                double d2 = DistanceUtil.calculateDistance(
                                                                userLat, userLon,
                                                                s2.getLatitude(), s2.getLongitude());

                                                return Double.compare(d1, d2);
                                        })
                                        .limit(5)
                                        .map(s -> new ShelterResponseDTO(
                                                        s.getId(),
                                                        s.getName(),
                                                        s.getLatitude(),
                                                        s.getLongitude(),
                                                        s.getCapacity()))
                                        .toList();

                        // Convert to JSON string
                        return objectMapper.writeValueAsString(result);

                } catch (Exception e) {
                        throw new RuntimeException("Serialization error");
                }
        }
}