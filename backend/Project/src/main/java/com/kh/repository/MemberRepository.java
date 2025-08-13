package com.kh.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
	
	@EntityGraph(attributePaths = { "memberRoleList" })
	@Query("select m from Member m where m.userId= :userId")
	Member getWithRoles(@Param("userId") String userId);
	
}
