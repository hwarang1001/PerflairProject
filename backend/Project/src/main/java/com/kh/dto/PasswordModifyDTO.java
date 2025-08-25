package com.kh.dto;

import lombok.Data;

@Data
public class PasswordModifyDTO {
	private String currentPassword;
	private String newPassword;
}
