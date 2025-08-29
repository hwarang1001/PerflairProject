package com.kh.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PasswordResetRequestDTO {
	private String userId; // 이메일(=아이디)
}