package com.kh.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.dto.MemberDTO;
import com.kh.dto.MemberModifyDTO;
import com.kh.dto.MemberSignupDTO;
import com.kh.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/member")
@Log4j2
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;
	
	

	// 회원 수정
	@PutMapping("/modify")
	public ResponseEntity<String> modifyMember(@RequestBody MemberModifyDTO memberModifyDTO) {
		try {
			memberService.modifyMember(memberModifyDTO);
			return ResponseEntity.ok("회원 정보가 성공적으로 수정되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("회원 정보 수정에 실패했습니다: " + e.getMessage());
		}
	}

	@GetMapping("/me")
	public MemberDTO getMyInfo() {
		// 1. SecurityContextHolder에서 Authentication 객체를 가져온다.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// 2. Authentication 객체에서 Principal을 추출한다.
		Object principal = authentication.getPrincipal();

		// 3. Principal이 MemberDTO 타입인지 확인하고 캐스팅한다.
		if (principal instanceof MemberDTO) {
			MemberDTO memberDTO = (MemberDTO) principal;
			log.info(memberDTO);
			return memberDTO;
		}

		// 4. Principal이 MemberDTO 타입이 아닌 경우 (ex: 'anonymousUser')
		log.error("Principal is not a MemberDTO instance. It is: " + principal.getClass().getName());
		return null; // 또는 적절한 예외 처리
	}


	// 회원 가입
	@PostMapping("/signup")
	public ResponseEntity<String> signup(@RequestBody MemberSignupDTO signupDTO) {
		try {
			memberService.signup(signupDTO);
			return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("회원가입에 실패했습니다: " + e.getMessage());
		}
	}

	// 회원 삭제
	@DeleteMapping("/{userId}")
	public ResponseEntity<String> deleteMember(@PathVariable String userId) {
		try {
			memberService.deleteMember(userId);
			return ResponseEntity.ok("회원이 성공적으로 삭제되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("회원 삭제에 실패했습니다: " + e.getMessage());
		}
	}
}
