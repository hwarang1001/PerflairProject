package com.kh.controller;

import java.util.Map;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.common.CurrentUser;
import com.kh.dto.MemberDTO;
import com.kh.dto.NoticeDTO;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.QuestionDTO;
import com.kh.dto.ReviewDTO;
import com.kh.service.QuestionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/** 로그인 사용자: 질의 작성/수정/삭제 */
@RestController
@Log4j2
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QuestionController {
	private final QuestionService service;
	private final CurrentUser cur;

	/** 작성 */
	@PostMapping("/")
	public ResponseEntity<?> create(@RequestBody QuestionDTO questionDTO,
			@AuthenticationPrincipal MemberDTO memberDTO) {
		questionDTO.setUserId(memberDTO.getUserId());
		Long id = service.create(cur.id(), questionDTO);
		return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", id));
	}
	
	@GetMapping("/{id}")
	public QuestionDTO get(@PathVariable Long id) {
	    return service.read(id);
	}
	@GetMapping("/list")
	public PageResponseDTO<QuestionDTO> list(PageRequestDTO pageRequestDTO) {
		log.info("list............." + pageRequestDTO);
		return service.list(pageRequestDTO);
	}
	
	/**
	 * 수정
	 * 
	 * @throws NotFoundException
	 */
	@PutMapping("/{id}")
	public void update(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) throws NotFoundException {
		service.update(id, cur.id(), questionDTO);
	}
	
	/**
	 * 삭제(소프트 딜리트)
	 * 
	 * @throws NotFoundException
	 */
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) throws NotFoundException {
		service.delete(id, cur.id());
	}
}
