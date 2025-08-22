package com.kh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.domain.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
