package com.kh.per;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Notice;
import com.kh.dto.NoticeDTO;
import com.kh.repository.NoticeRepository;
import com.kh.service.NoticeService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class NoticeApplicationTest {

	@Autowired
	NoticeRepository noticeRepository;
	@Autowired
	NoticeService noticeService;

//	 @Test
	public void insertTest() {
		NoticeDTO noticeDTO = NoticeDTO.builder().title("test").content("공지사항 테스트").build();

		noticeService.register(noticeDTO);
	}

	// @Test
	public void testRead() {
		// 실제 존재하는 번호로 테스트(DB에서 확인)
		Long pno = 1L;
		NoticeDTO noticeDTO = noticeService.get(pno);
		log.info(noticeDTO);
	}

	//@Test
	public void testUpdate() {
		Long pno = 1L;
		Notice notice = noticeRepository.findById(pno).get();
		notice.changeContent("update");
		notice.changeTitle("updateTest");
		
		noticeRepository.save(notice);
	}
	@Commit 
	@Transactional 
	@Test 
	public void testDelete() {
		Long pno = 1L;
		noticeRepository.updateToDelete(pno, true);
	}


}
