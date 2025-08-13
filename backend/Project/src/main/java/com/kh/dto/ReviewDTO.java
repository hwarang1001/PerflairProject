package com.kh.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kh.domain.Member;
import com.kh.domain.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder        // 빌더 패턴으로 생성 편리하게
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private Long reviewId;
    private String userId;
    private Long pno;
    private Integer rating;
    private LocalDate createdAt;
    private String content;
    
    
 // 업로드 할 파일들
  	@Builder.Default
  	private List<MultipartFile> files = new ArrayList<>();

  	// DB에 저장된 파일명 리스트
  	@Builder.Default
  	private List<String> uploadFileNames = new ArrayList<>();
}