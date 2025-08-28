package com.kh.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Member;
import com.kh.domain.MemberRole;
import com.kh.dto.AddressDTO;
import com.kh.dto.MemberModifyDTO;
import com.kh.dto.MemberSignupDTO;
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

}
