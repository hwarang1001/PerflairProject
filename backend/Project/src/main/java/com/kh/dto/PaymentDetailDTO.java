package com.kh.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentDetailDTO {
	private Long productOptionId;
	private String pname;
	private int qty;
	private Long price;
}
