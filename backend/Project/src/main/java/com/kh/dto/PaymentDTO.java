package com.kh.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentDTO {
	private Long paymentId;
	private String payStatus;
	private Long totalAmount;
	private List<PaymentDetailDTO> details; // PaymentDetail DTO 리스트
}
