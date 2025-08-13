package com.kh.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.kh.dto.MemberDTO;

@Component
public class CurrentUser {
    public String id() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || a.getPrincipal() == null) return null;

        Object principal = a.getPrincipal();

        if (principal instanceof MemberDTO) {
            return ((MemberDTO) principal).getUserId();  // MemberDTO에 getId() 있어야 함
        } else if (principal instanceof String) {
            return (String) principal; // 익명 사용자 등일 때
        } else {
            return null; // 알 수 없는 타입
        }
    }
}