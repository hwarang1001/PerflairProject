package com.kh.service;


import com.kh.domain.Member;
import com.kh.dto.AddressDTO;
import com.kh.dto.MemberModifyDTO;
import com.kh.dto.MemberSignupDTO;

public interface MemberService {

	void modifyMember(MemberModifyDTO memberModifyDTO);
	
	void signup(MemberSignupDTO memberDTO, AddressDTO addressDTO);
	
	void deleteMember(String userId);
	
	Member getMember(String userId);
	
	
}
