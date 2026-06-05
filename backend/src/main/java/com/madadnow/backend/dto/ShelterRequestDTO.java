package com.madadnow.backend.dto;

import lombok.Data;

@Data
public class ShelterRequestDTO {
    private String name;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private Long tenantId;
}