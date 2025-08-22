package com.kh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private String userId;     // 장바구니 소유자
    private Long productOptionId; // 어떤 옵션인지
    private int qty;           // 담을 수량
}