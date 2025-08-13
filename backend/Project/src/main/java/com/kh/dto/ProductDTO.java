package com.kh.dto;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ProductDTO {

	private Long pno;
	private String brand;
	private String pname;
	private boolean delFlag;
	private String pdesc;

	// 업로드 할 파일들
	@Builder.Default
	private List<MultipartFile> files = new ArrayList<>();

	// DB에 저장된 파일명 리스트
	@Builder.Default
	private List<String> uploadFileNames = new ArrayList<>();

	// DB에 저장된 옵션 리스트
	@Builder.Default
	private List<ProductOptionDTO> options = new ArrayList<>();
}