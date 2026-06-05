package com.madadnow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TenantResponseDTO {
    private Long id;
    private String name;
    private String email;
}