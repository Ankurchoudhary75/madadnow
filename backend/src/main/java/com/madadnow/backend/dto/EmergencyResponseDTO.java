package com.madadnow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmergencyResponseDTO {

    private String message;
    private String nearbyShelters; // 🔥 CHANGED TO STRING
}