package com.kh.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.kh.domain.Member;
import com.kh.domain.MemberRole;
import com.kh.dto.AddressDTO;
import com.kh.dto.KakaoMemberModifyDTO;
import com.kh.dto.MemberDTO;
import com.kh.dto.MemberModifyDTO;
import com.kh.dto.MemberSignupDTO;
import com.kh.dto.PasswordModifyDTO;
import com.kh.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final AddressService addressService; 

	// 추가: 아주 단순한 인메모리 토큰 저장(서버 재시작 시 초기화)
	private static final Map<String, ResetToken> RESET_TOKENS = new ConcurrentHashMap<>();
	private static final long EXPIRE_MILLIS = 10 * 60 * 1000L; // 10분

	@Override
	public void modifyMember(MemberModifyDTO memberModifyDTO) {
		Optional<Member> result = memberRepository.findById(memberModifyDTO.getUserId());
		Member member = result.orElseThrow();

		member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
		member.changePhoneNum(memberModifyDTO.getPhoneNum());
		memberRepository.save(member);
	}

	@Override
	public void signup(MemberSignupDTO memberDTO, AddressDTO addressDTO) {
		if (memberRepository.existsById(memberDTO.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        Member member = Member.builder()
                .userId(memberDTO.getUserId())
                .pw(passwordEncoder.encode(memberDTO.getPw()))
                .name(memberDTO.getName())
                .phoneNum(memberDTO.getPhoneNum())
                .social(false)
                .build();
        member.addRole(MemberRole.USER);
        memberRepository.save(member);
        
        addressService.add(memberDTO.getUserId(), addressDTO);
	}

//	// 💡 로그인 로직
//    @Override
//    public Map<String, String> login(LoginDTO loginDTO) {
//        log.info("MemberService login attempt for user: {}", loginDTO.getUserId());
//        Optional<Member> result = memberRepository.findById(loginDTO.getUserId());
//
//        if (result.isEmpty()) {
//            log.warn("Login failed: User not found with ID {}", loginDTO.getUserId());
//            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
//        }

//        Member member = result.get();
//        // 비밀번호 일치 여부 확인
//        if (!passwordEncoder.matches(loginDTO.getPassword(), member.getPw())) {
//            log.warn("Login failed: Invalid password for user {}", loginDTO.getUserId());
//            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
//        }
//
//        // 로그인 성공 시 JWT 토큰 생성
//        Map<String, Object> claims = Map.of(
//                "userId", member.getUserId(),
//                "roleNames", member.getRoleNames()
//        );
//        String accessToken = JWTUtil.generateToken(claims, 10);
//        String refreshToken = JWTUtil.generateToken(claims, 60 * 24);
//
//        return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
//    }
	
	  @Override
	    public void deleteMember(String userId) {
	        if (!memberRepository.existsById(userId)) {
	            throw new IllegalArgumentException("해당 회원이 존재하지 않습니다.");
	        }
	        memberRepository.deleteById(userId);
	    }
	  
	  @Override
	  public Member getMember(String userId) {
	      return memberRepository.findById(userId)
	          .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
	  }
	  
	  @Override
		public MemberDTO getKakaoMember(String accessToken) {
		    // 💡 카카오 API에서 이메일과 닉네임 정보를 한 번에 가져오기
		    String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";
		    RestTemplate restTemplate = new RestTemplate();
		    HttpHeaders headers = new HttpHeaders();
		    headers.add("Authorization", "Bearer " + accessToken);
		    HttpEntity<String> entity = new HttpEntity<>(headers);
		    UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();
		    
		    // API 호출 및 응답 처리
		    ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toString(), HttpMethod.GET, entity, LinkedHashMap.class);
		    LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
		    
		    // 이메일과 닉네임 추출
		    LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");
		    LinkedHashMap<String, String> profile = (LinkedHashMap<String, String>) (Object) kakaoAccount.get("profile");
		    
		    String email = kakaoAccount.get("email");
		    String nickname = profile.get("nickname");

		    log.info("email: " + email);
		    log.info("nickname: " + nickname);
		    
		    // 💡 이메일이 null일 경우 처리 (필수 동의X 또는 토큰 오류)
		    if (email == null) {
		        log.warn("Kakao email is null. Cannot proceed.");
		        return null;
		    }
		    
		    // 기존 회원 여부 확인
		    Optional<Member> result = memberRepository.findById(email);
		    
		    if (result.isPresent()) {
		        // 기존 회원이면 DTO로 변환하여 반환
		        return entityToDTO(result.get());
		    }
		    
		    // 신규 회원이면 회원 생성
		    Member socialMember = makeSocialMember(email, nickname); // 닉네임 전달
		    memberRepository.save(socialMember);
		    
		    return entityToDTO(socialMember);
		}

		private Member makeSocialMember(String email, String nickname) {
			String tempPassword = makeTempPassword();
			log.info("tempPassword: " + tempPassword);
			Member member = Member.builder().userId(email).pw(passwordEncoder.encode(tempPassword)).name(nickname)
					.social(true).build();
			member.addRole(MemberRole.USER);
			return member;
		}

		private String makeTempPassword() {
			StringBuffer buffer = new StringBuffer();
			for (int i = 0; i < 10; i++) {
				buffer.append((char) ((int) (Math.random() * 55) + 65));
			}
			return buffer.toString();
		}

		
		@Override
		public void kakaoModifyMember(KakaoMemberModifyDTO kakaomemberModifyDTO) {
			Optional<Member> result = memberRepository.findById(kakaomemberModifyDTO.getUserId());
			Member member = result.orElseThrow();
			// 내일 주소 구현 
			member.changePhoneNum(kakaomemberModifyDTO.getPhoneNum());
			memberRepository.save(member);
		}

	@Override
	public void modifyPassword(String userId, PasswordModifyDTO passwordModifyDTO) {
		Member member = memberRepository.findById(userId).orElseThrow();

		if (!passwordEncoder.matches(passwordModifyDTO.getCurrentPassword(), member.getPw())) {
			throw new BadCredentialsException("현재 비밀번호가 올바르지 않습니다.");
		}

		member.changePw(passwordEncoder.encode(passwordModifyDTO.getNewPassword()));
		memberRepository.save(member);

	}

	@Override
	public boolean isUserIdExists(String userId) {
		return memberRepository.existsById(userId);
	}

	@Override
	public List<String> findUserIdsByNameAndPhone(String name, String phoneNum) {
		return memberRepository.findAllByNameAndPhoneNum(name, phoneNum).stream().map(Member::getUserId).toList();
	}

	@Override
	public List<String> findMaskedUserIdsByNameAndPhone(String name, String phoneNum) {
		return memberRepository.findAllByNameAndPhoneNum(name, phoneNum).stream().map(Member::getUserId) // 원본 이메일
				.map(MemberServiceImpl::maskEmailForHint) // ← 여기서 반드시 마스킹
				.toList(); // JDK11 호환
	}

	// 앞(local)만 규칙대로 마스킹
	private static String maskEmailForHint(String email) {
		if (email == null || !email.contains("@"))
			return "계정 정보";
		String[] parts = email.split("@", 2);
		String local = parts[0];
		String domain = parts[1];

		String maskedLocal = maskLocalByRule(local);
		return maskedLocal + "@" + domain;
	}

	private static String maskLocalByRule(String s) {
		int n = (s == null) ? 0 : s.length();
		if (n == 0)
			return "";
		if (n == 1) {
			// 1글자: 그대로
			return s;
		}
		if (n == 2) {
			// 2글자: 마지막 1글자만 *
			return s.substring(0, 1) + "*";
		}
		if (n == 3) {
			// 3글자: 뒤 2글자 *
			return s.substring(0, 1) + "**";
		}
		if (n == 4) {
			// 4글자: 뒤 2글자 *
			return s.substring(0, 2) + "**";
		}
		if (n == 5) {
			// 5글자: 뒤 3글자 *
			return s.substring(0, 2) + "***";
		}
		// n >= 6: 마지막 2글자 노출, 그 앞의 3글자만 *** 처리
		// 즉, [0 .. n-5) + "***" + [n-2 .. n)
		String prefix = s.substring(0, n - 5);
		String tail = s.substring(n - 2);
		return prefix + "***" + tail;
	}

	@Override
	public void startPasswordReset(String userId) {
		// 계정 존재 여부는 응답으로 드러내지 않음(열거 방지)
		Optional<Member> opt = memberRepository.findByUserId(userId);
		if (opt.isEmpty()) {
			log.info("[PW-RESET] request for non-existing user: {}", userId);
			return;
		}

		String code = String.format("%06d", new Random().nextInt(1_000_000));
		long exp = Instant.now().toEpochMilli() + EXPIRE_MILLIS;
		RESET_TOKENS.put(userId, new ResetToken(code, exp));

		// 운영에선 메일 발송 연결, 지금은 로그로 확인
		log.info("[PW-RESET] {} -> code: {} (expires in 10m)", userId, code);
	}

	@Override
	public boolean confirmPasswordReset(String userId, String code, String newPassword) {
		ResetToken token = RESET_TOKENS.get(userId);
		long now = Instant.now().toEpochMilli();
		if (token == null || now > token.expiresAt || !token.code.equals(code)) {
			return false; // ← 실패면 false
		}
		Member m = memberRepository.findByUserId(userId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계정입니다."));
		m.changePw(passwordEncoder.encode(newPassword));
		memberRepository.save(m);
		RESET_TOKENS.remove(userId);
		return true; // ← 성공이면 true
	}

	// 내부 record (새 파일 아님)
	private record ResetToken(String code, long expiresAt) {
	}
}
