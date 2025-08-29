package com.kh.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.dto.FindIdRequestDTO;
import com.kh.dto.FindIdResponseDTO;
import com.kh.dto.PasswordResetConfirmRequestDTO;
import com.kh.dto.PasswordResetRequestDTO;
import com.kh.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Log4j2
public class LoginSupportController {

	private final MemberService memberService;

	/** 1) 아이디 찾기: 이름 + 휴대폰으로 userId(email) 조회 */
	@PostMapping("/find-id")
	public ResponseEntity<?> findId(@RequestBody FindIdRequestDTO req) {
		List<String> masked = memberService.findMaskedUserIdsByNameAndPhone(req.getName(), req.getPhoneNum());
		return ResponseEntity.ok(masked); // 또는 DTO
	}

	/** 2) 비밀번호 재설정 시작: 인증코드 발송 */
	@PostMapping("/password-reset")
	public ResponseEntity<?> startPasswordReset(@RequestBody PasswordResetRequestDTO req) {
		try {
			memberService.startPasswordReset(req.getUserId()); // 이메일/SMS 발송 로직 내부 구현
			return ResponseEntity.ok(Map.of("result", "OK"));
		} catch (Exception e) {
			log.error("password-reset start error", e);
			return ResponseEntity.badRequest().body(Map.of("message", "재설정 요청에 실패했습니다."));
		}
	}

	/** 3) 비밀번호 재설정 확정: 코드 검증 + 새 비밀번호 저장 */
	@PostMapping("/password-reset/confirm")
	public ResponseEntity<?> confirmPasswordReset(@RequestBody PasswordResetConfirmRequestDTO req) {
		try {
			boolean ok = memberService.confirmPasswordReset(req.getUserId(), req.getCode(), req.getNewPassword());
			if (!ok) {
				return ResponseEntity.badRequest().body(Map.of("message", "인증코드가 유효하지 않거나 만료되었습니다."));
			}
			return ResponseEntity.ok(Map.of("result", "OK"));
		} catch (Exception e) {
			log.error("password-reset confirm error", e);
			return ResponseEntity.badRequest().body(Map.of("message", "비밀번호 재설정에 실패했습니다."));
		}
	}
}
