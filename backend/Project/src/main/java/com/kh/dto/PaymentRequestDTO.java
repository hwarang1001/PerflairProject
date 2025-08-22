package com.kh.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class PaymentRequestDTO {
	private String userId;

	private String payMethod;
}
