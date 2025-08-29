package com.kh.service;

import java.util.List;

import com.kh.domain.Member;
import com.kh.dto.AddressDTO;
import com.kh.dto.MemberModifyDTO;
import com.kh.dto.MemberSignupDTO;
import com.kh.dto.PasswordModifyDTO;

public interface MemberService {

	void modifyMember(MemberModifyDTO memberModifyDTO);
	
	void signup(MemberSignupDTO memberDTO, AddressDTO addressDTO);
	
	void deleteMember(String userId);

	Member getMember(String userId);

	void modifyPassword(String userId, PasswordModifyDTO passwordModifyDTO);
	
	// 아이디(이메일) 중복확인
	boolean isUserIdExists(String userId);
	
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
	
=======
	// 아이디(이메일) 찾기
	List<String> findUserIdsByNameAndPhone(String name, String phoneNum);
	List<String> findMaskedUserIdsByNameAndPhone(String name, String phoneNum);

	// 비밀번호 재설정(1) 코드 발급
	void startPasswordReset(String userId);

	// 비밀번호 재설정(2) 코드 확인 + 비번 변경
	boolean confirmPasswordReset(String userId, String code, String newPassword);


>>>>>>> Stashed changes
>>>>>>> Stashed changes
}
