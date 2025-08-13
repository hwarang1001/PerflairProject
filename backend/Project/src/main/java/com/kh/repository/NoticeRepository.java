package com.kh.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

	// @Modifying 어노테이션은 @Query가 SELECT가 아닌 DML(UPDATE, DELETE 등)일 때 필요함.
	@Modifying
	@Query("update Notice n set n.delFlag = :flag where n.noticeId = :noticeId")
	void updateToDelete(@Param("noticeId") Long noticeId, @Param("flag") boolean flag);

	// 삭제되지 않은(delFlag = false) 공지사항 목록을 페이징 처리하여 조회
	// JPQL을 사용하여 Notice 엔티티를 직접 조회합니다.
	@Query("SELECT n FROM Notice n WHERE n.delFlag = false ORDER BY n.noticeId DESC")
	Page<Notice> findAllNotDeleted(Pageable pageable);
}
