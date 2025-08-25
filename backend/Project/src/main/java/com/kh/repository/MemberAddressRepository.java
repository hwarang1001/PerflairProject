package com.kh.repository;

import com.kh.domain.MemberAddress;
import java.util.List;
import org.springframework.data.jpa.repository.*;

public interface MemberAddressRepository extends JpaRepository<MemberAddress, Long> {

	long countByMember_UserId(String userId);

	List<MemberAddress> findAllByMember_UserIdOrderByIsDefaultDescIdDesc(String userId);

	@Modifying
	@Query("update MemberAddress a set a.isDefault=false where a.member.userId=:userId")
	int clearDefault(String userId);
}
