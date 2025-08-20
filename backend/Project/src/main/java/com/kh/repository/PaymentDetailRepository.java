package com.kh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.domain.PaymentDetail;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetail, Long> {

}
