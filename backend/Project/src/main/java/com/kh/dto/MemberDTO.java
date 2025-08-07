package com.kh.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter 
@Setter 
@ToString 
public class MemberDTO extends User {

	private static final long serialVersionUID = 1L;
	private String userId;
	private String pw;
	private String name;
	private String address;
	private String phoneNum;
	private boolean social;
	private List<String> roleNames = new ArrayList<>();

	// 🔑 비밀번호는 부모 클래스(User)에만 전달하고, Claims에는 저장하지 않음
    public MemberDTO(String userId, String pw, String name, String address, String phoneNum, boolean social, List<String> roleNames) {
        super(userId, pw,
            roleNames.stream()
                     .map(str -> new SimpleGrantedAuthority("ROLE_" + str))
                     .collect(Collectors.toList()));
        this.userId = userId;
        this.name = name;
        
        // 🚨 이 부분에서 null 체크 로직을 추가했습니다.
        // address와 phoneNum이 null일 경우 빈 문자열로 초기화합니다.
        this.address = (address != null) ? address : "";
        this.phoneNum = (phoneNum != null) ? phoneNum : "";
        
        this.social = social;
        this.roleNames = roleNames;
    }

    // JWT Claims 생성 (민감정보 제외)
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("userId", userId);
        dataMap.put("name", name);
        dataMap.put("address", address);
        dataMap.put("phoneNum", phoneNum);
        dataMap.put("social", social);
        dataMap.put("roleNames", roleNames);
        return dataMap;
    }
}