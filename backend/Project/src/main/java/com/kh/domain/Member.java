package com.kh.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
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

	public void changeAddress(String address) {
		this.address = address;
	}

	public void changePw(String pw) {
		this.pw = pw;
	}

	public void changePhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}

	// 💡 memberRoleList에서 역할 이름(String)만 추출하는 메서드 추가
	public List<String> getRoleNames() {
		return memberRoleList.stream().map(MemberRole::name).collect(Collectors.toList());
	}

}
