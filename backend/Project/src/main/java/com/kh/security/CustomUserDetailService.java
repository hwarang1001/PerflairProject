package com.kh.security;

import java.util.stream.Collectors;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.kh.domain.Member;
import com.kh.dto.MemberDTO;

import com.kh.domain.Member;
import com.kh.dto.MemberDTO;
import com.kh.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

	private final MemberRepository memberRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		//
		Member member = memberRepository.getWithRoles(username);
		if (member == null) {
			throw new UsernameNotFoundException("Not Found");
		}
		MemberDTO memberDTO = new MemberDTO(member.getUserId(), member.getPw(), member.getName(), member.getAddress(),
				member.getPhoneNum(), member.isSocial(),
				member.getMemberRoleList().stream().map(memberRole -> memberRole.name()).collect(Collectors.toList()));
		log.info(memberDTO);
		return memberDTO;
	}
}
