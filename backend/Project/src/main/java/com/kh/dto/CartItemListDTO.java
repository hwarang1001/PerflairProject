package com.kh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemListDTO {
	private Long cino; // CartItem ID
	private int qty; // 수량
	private Long productOptionId; // 옵션 ID
	private String pname; // 상품명
	private int price; // 옵션 가격
	private int perfumeVol; // 옵션 용량
	private String imageFile; // 이미지 파일 경로
	
	public CartItemListDTO(Long cino, int qty, Long productOptionId, String pname, int price, String imageFile) {
		this.cino = cino;
		this.qty = qty;
		this.productOptionId = productOptionId;
		this.pname = pname;
		this.price = price;
		this.imageFile = imageFile;
	}
}