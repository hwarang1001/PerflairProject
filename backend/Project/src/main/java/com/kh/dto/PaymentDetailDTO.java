package com.kh.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentDetailDTO {
	private Long productOptionId;
	private Long pno;
	private String brand;
	private String pname;
	private int perfumeVol;
	private String imageFile;
	private int qty;
	private int price;
}
