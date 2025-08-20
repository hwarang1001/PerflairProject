package com.kh.dto;

import java.time.LocalDate;
import java.util.List;

import com.kh.domain.QuestionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
/** 질의 작성 요청 DTO */
public class QuestionDTO {

	private Long questionId;
	private String userId;
	private String title;
	private String content;
	private LocalDate createdAt;
	private QuestionStatus status;

	private AnswerDTO answer;
}
