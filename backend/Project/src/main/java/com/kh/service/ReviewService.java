package com.kh.service;

import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ReviewDTO;

public interface ReviewService {

	// 리뷰 등록 (등록 후 생성된 리뷰 ID 리턴)
	Long register(ReviewDTO reviewDTO);

	// 단일 리뷰 조회
	ReviewDTO get(Long reviewId);

	// 리뷰 삭제
	void remove(Long reviewId);

	// 리뷰 목록 조회 (페이징 처리)
	PageResponseDTO<ReviewDTO> list(PageRequestDTO pageRequestDTO);
}
