package com.kh.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentHistoryDTO {
	private Long paymentId;
	private String userId;
	private Long totalAmount;
	private LocalDate paymentDate;
	private String payMethod;
	private List<PaymentDetailDTO> details; // PaymentDetail DTO 리스트
	private String shippingAddress;
}