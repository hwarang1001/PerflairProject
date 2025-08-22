package com.kh.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.dto.AnswerDTO;
import com.kh.dto.AnswerUpdateDTO;
import com.kh.dto.MemberDTO;
import com.kh.dto.QuestionDTO;
import com.kh.repository.AnswerRepository;
import com.kh.service.AnswerService;
import com.kh.service.QuestionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

	private final AnswerService answerService;
	private final QuestionService questionService;
	private final AnswerRepository answerRepository;

	/** 등록 - 유효성 위반 시 400 */
	@PostMapping("/")
	public ResponseEntity<?> register(@RequestBody @Validated AnswerDTO dto, @AuthenticationPrincipal MemberDTO memberDTO) {

		// ⭐️ MemberDTO에서 userId를 가져와 AnswerDTO에 설정
		String userId = memberDTO.getUserId();
		dto.setUserId(userId);

		Long id = answerService.register(dto);
		return ResponseEntity.ok(Map.of("result", id));
	}

	@GetMapping("/{id}")
		public ResponseEntity<QuestionDTO> read(@PathVariable Long id) {
	    QuestionDTO q = questionService.read(id);

	    // 답변이 있으면 끼워넣기
	    answerRepository.findByQuestionId_QuestionId(id)
	            .map(a -> AnswerDTO.builder()
	                    .answerId(a.getAnswerId())
	                    .questionId(a.getQuestionId().getQuestionId())
	                    .userId(a.getAdmin().getUserId())
	                    .adminName(a.getAdmin().getName())
	                    .content(a.getContent())
	                    .createdAt(a.getCreatedAt())
	                    .updatedAt(a.getUpdatedAt())
	                    .build()).ifPresent(q::setAnswer);

	    return ResponseEntity.ok(q);
	}

	/** 수정(내용만) - AnswerUpdateDTO */
	@PutMapping("/{answerId}")
	public ResponseEntity<?> modify(@PathVariable Long answerId, @RequestBody @Validated AnswerUpdateDTO dto) {
		answerService.modify(answerId, dto.getContent());
		return ResponseEntity.ok(Map.of("result", "SUCCESS"));
	}

}
