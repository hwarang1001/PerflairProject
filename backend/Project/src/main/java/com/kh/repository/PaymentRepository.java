package com.kh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.domain.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	// 사용자 ID를 기준으로 모든 결제 정보를 최신순으로 조회하는 메서드
    List<Payment> findByCart_Owner_UserIdOrderByPaymentDateDesc(String userId);
}
