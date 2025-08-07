package com.kh.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.dto.NoticeDTO;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.service.NoticeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/notice")
public class NoticeController {

	private final NoticeService noticeService;

	@PostMapping
	public Map<String, Long> register(@ModelAttribute NoticeDTO noticeDTO) {

		Long pno = noticeService.register(noticeDTO);
		return Map.of("result", pno);
	}
	
	@GetMapping("/list")
	public PageResponseDTO<NoticeDTO> list(PageRequestDTO pageRequestDTO) {
		log.info("list............." + pageRequestDTO);
		return noticeService.list(pageRequestDTO);
	}
	
	@GetMapping("/{noticeId}")
	public NoticeDTO read(@PathVariable(name = "noticeId") Long noticeId) {
		return noticeService.get(noticeId);
	}
	@PutMapping("/{noticeId}")
	public Map<String, String> modify(@PathVariable(name = "noticeId") Long noticeId, NoticeDTO noticeDTO) {
		noticeDTO.setNoticeId(noticeId);
		// 수정 작업
		noticeService.modify(noticeDTO);
		return Map.of("RESULT", "SUCCESS");
	}
	@DeleteMapping("/{noticeId}") 
	public Map<String, String> remove(@PathVariable("noticeId") Long noticeId) {
		// 삭제해야 할 파일들 알아내기
		noticeService.remove(noticeId);
		return Map.of("RESULT", "SUCCESS");
	}
	
}
