package com.madadnow.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.madadnow.backend.model.Tenant;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
}