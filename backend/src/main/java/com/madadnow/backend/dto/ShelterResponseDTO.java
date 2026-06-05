package com.madadnow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class ShelterResponseDTO implements Serializable {
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
}