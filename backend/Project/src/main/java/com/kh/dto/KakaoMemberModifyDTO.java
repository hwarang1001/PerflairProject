package com.kh.dto;

import lombok.Data;

@Data
public class KakaoMemberModifyDTO {
    private String userId;    // 이메일 또는 아이디
    private String name;      // 이름(닉네임 역할 가능)
    private String address;   // 전체 주소
    private String phoneNum;  // 전화번호
}