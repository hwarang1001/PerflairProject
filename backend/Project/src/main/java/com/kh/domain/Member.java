package com.kh.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "tbl_member")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "memberRoleList")
public class Member {
    @Id
    private String userId;
    private String pw;
    private String name;
    private String address;
    private String phoneNum;
    private boolean social;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<>();

    public void addRole(MemberRole memberRole) {
        memberRoleList.add(memberRole);
    }

    public void clearRole() {
        memberRoleList.clear();
    }

	public void changePw(String pw) {
		this.pw = pw;
	}

	public void changeSocial(boolean social) {
		this.social = social;
	}

	public void changeAddress(String address) {
		this.address = address;
	}

	public void changePhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}
}
