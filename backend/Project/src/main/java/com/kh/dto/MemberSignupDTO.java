package com.kh.dto;

import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class MemberSignupDTO {
    private String userId;    // 이메일 또는 아이디
    private String pw;        // 비밀번호
    private String name;      // 이름(닉네임 역할 가능)
    private String phoneNum;  // 전화번호
    private boolean social;   // 소셜 로그인 여부
    private AddressDTO addressDTO;
}
