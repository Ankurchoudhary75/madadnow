package com.madadnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.madadnow.backend.model.Shelter;

public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    List<Shelter> findByTenantId(Long tenantId);
}