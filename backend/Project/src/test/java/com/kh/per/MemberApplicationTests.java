package com.kh.per;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.kh.domain.Member;
import com.kh.domain.MemberRole;
import com.kh.repository.MemberRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class MemberApplicationTests {
	
	@Autowired 
	MemberRepository memberRepository;
	@Autowired  
	PasswordEncoder passwordEncoder; 
	
	@Test
	public void testInsertMember() {
		for(int i=0; i<10; i++) {
			Member member = Member.builder().userId("user"+i+"@naver.com")
					.pw(passwordEncoder.encode("1234")).name("user"+i).address("서울")
					.phoneNum("010-1111-1111").build();
			member.addRole(MemberRole.USER);
			if(i>=5) {
				member.addRole(MemberRole.ADMIN);
			}
			memberRepository.save(member);
		}
	}
}
