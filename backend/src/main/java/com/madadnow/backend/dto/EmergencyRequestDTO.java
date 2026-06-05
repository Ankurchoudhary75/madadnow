package com.madadnow.backend.dto;

import lombok.Data;

@Data
public class EmergencyRequestDTO {
    private Double latitude;
    private Double longitude;
    private Long tenantId;
}