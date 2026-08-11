package com.placementintelligence.repository;

import com.placementintelligence.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository
    extends JpaRepository<Company, Long> {

    Optional<Company> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Company> findByIsActiveTrueOrderByNameAsc();
}
