package com.kh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.domain.ProductOption;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Long> {

}