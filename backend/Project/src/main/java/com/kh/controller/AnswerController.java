package com.kh.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
import com.kh.service.AnswerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

	private final AnswerService answerService;

	/** 등록 - 유효성 위반 시 400 */
	@PostMapping("/")
	public ResponseEntity<?> register(@RequestBody @Valid AnswerDTO dto, @AuthenticationPrincipal MemberDTO memberDTO) {

		 // ⭐️ MemberDTO에서 userId를 가져와 AnswerDTO에 설정
        String userId = memberDTO.getUserId();
        dto.setUserId(userId); 
        
		Long id = answerService.register(dto);
		return ResponseEntity.ok(Map.of("result", id));
	}

	/** 단건 조회(미삭제만) */
	@GetMapping("/{answerId}")
	public ResponseEntity<AnswerDTO> read(@PathVariable Long answerId) {
		return ResponseEntity.ok(answerService.read(answerId));
	}

	/** 수정(내용만) - AnswerUpdateDTO */
	@PutMapping("/{answerId}")
	public ResponseEntity<?> modify(@PathVariable Long answerId, @RequestBody @Valid AnswerUpdateDTO dto) {
		answerService.modify(answerId, dto.getContent());
		return ResponseEntity.ok(Map.of("result", "SUCCESS"));
	}

}
