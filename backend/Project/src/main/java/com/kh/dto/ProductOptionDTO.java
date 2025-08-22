package com.kh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOptionDTO {
	private Long oid;
	private int price;
	private int stock;
	private int perfumeVol;
}