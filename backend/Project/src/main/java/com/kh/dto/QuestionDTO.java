package com.kh.dto;

import java.time.LocalDateTime;

import com.kh.domain.Member;
import com.kh.domain.QuestionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
@Data
@AllArgsConstructor
@Builder
@RequiredArgsConstructor
/** 질의 작성 요청 DTO */
public class QuestionDTO {
   
	private Long questionId;
	private String userId;
	private String title;
	private String content;
	private LocalDateTime createdAt;
	private QuestionStatus status;
}
