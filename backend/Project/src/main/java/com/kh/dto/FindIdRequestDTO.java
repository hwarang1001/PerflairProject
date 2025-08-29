package com.kh.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FindIdRequestDTO {
	private String name;
	private String phoneNum;
}
