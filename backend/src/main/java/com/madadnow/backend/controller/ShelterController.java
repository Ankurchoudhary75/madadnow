package com.madadnow.backend.controller;

import com.madadnow.backend.dto.*;
import com.madadnow.backend.service.ShelterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    // CREATE
    @PostMapping
    public ShelterResponseDTO createShelter(@RequestBody ShelterRequestDTO dto) {
        return shelterService.createShelter(dto);
    }

    // GET by tenant
    @GetMapping("/{tenantId}")
    public List<ShelterResponseDTO> getShelters(@PathVariable Long tenantId) {
        return shelterService.getSheltersByTenant(tenantId);
    }

    // 🔥 NEAREST (STRING RESPONSE)
    @GetMapping("/nearest")
    public String getNearestShelters(
            @RequestParam Long tenantId,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        return shelterService.findNearestShelters(tenantId, latitude, longitude);
    }
}