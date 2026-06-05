package com.madadnow.backend.repository;

import com.madadnow.backend.model.EmergencyRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyRepository extends JpaRepository<EmergencyRequest, Long> {
}