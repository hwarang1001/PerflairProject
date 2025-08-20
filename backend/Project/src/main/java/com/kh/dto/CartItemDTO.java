package com.kh.dto;

import lombok.Data;

@Data 
public class CartItemDTO {  
private String userId; 
private Long pno;  
private int qty; 
private Long cino; 
}
