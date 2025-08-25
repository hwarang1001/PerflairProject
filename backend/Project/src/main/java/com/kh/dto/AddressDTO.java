package com.kh.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
	private Long id;
	private String receiverName;
	private String phone;
	private String zonecode;
	private String address;
	private String detailAddress;
	private String memo;
	private boolean isDefault;
}
