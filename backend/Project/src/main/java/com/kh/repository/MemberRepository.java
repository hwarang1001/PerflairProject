package com.kh.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
	
	@EntityGraph(attributePaths = { "memberRoleList" })
	@Query("select m from Member m where m.userId= :userId")
	Member getWithRoles(@Param("userId") String userId);
	
	List<Member> findAllByNameAndPhoneNum(String name, String phoneNum);
    Optional<Member> findByUserId(String userId); // userId = 이메일
	
}
