package com.kh.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PasswordResetConfirmRequestDTO {
	private String userId;
	private String code;
	private String newPassword;
}