package com.kh.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Notice;
import com.kh.domain.Product;
import com.kh.domain.ProductImage;
import com.kh.dto.NoticeDTO;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ProductDTO;
import com.kh.repository.NoticeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {

	private final NoticeRepository noticeRepository;

	@Override
	public PageResponseDTO<NoticeDTO> list(PageRequestDTO pageRequestDTO) {
		log.info("getList ");
		// 페이지 시작 번호가 0 부터 시작하므로
		Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
				Sort.by("pno").descending());
		Page<Notice> result = noticeRepository.findAllNotDeleted(pageable);
		List<NoticeDTO> dtoList = result.get().map(notice -> {
			NoticeDTO noticeDTO = NoticeDTO.builder().noticeId(notice.getNoticeId()).title(notice.getTitle())
					.content(notice.getContent()).createdAt(notice.getCreatedAt()).updateAt(notice.getUpdateAt())
					.build();
			return noticeDTO;
		}).collect(Collectors.toList());
		long totalCount = result.getTotalElements();
		return PageResponseDTO.<NoticeDTO>withAll().dtoList(dtoList).totalCount(totalCount)
				.pageRequestDTO(pageRequestDTO).build();
	}

	@Override
	public Long register(NoticeDTO noticeDTO) {
		Notice notice = dtoToEntity(noticeDTO);
		Notice result = noticeRepository.save(notice);
		return result.getNoticeId();
	}

	private Notice dtoToEntity(NoticeDTO noticeDTO) {
		Notice notice = Notice.builder().title(noticeDTO.getTitle()).content(noticeDTO.getContent()).build();
		return notice;
	}

	@Override
	public NoticeDTO get(Long noticeId) {
		java.util.Optional<Notice> result = noticeRepository.findById(noticeId);
		Notice notice = result.orElseThrow();
		NoticeDTO noticeDTO = entityToDTO(notice);
		return noticeDTO;
	}

	private NoticeDTO entityToDTO(Notice notice) {
		NoticeDTO noticeDTO = NoticeDTO.builder().noticeId(notice.getNoticeId()).title(notice.getTitle())
				.content(notice.getContent()).createdAt(notice.getCreatedAt()).updateAt(notice.getUpdateAt())
				.delFlag(notice.isDelFlag()).build();

		return noticeDTO;
	}

	@Override
	public void modify(NoticeDTO noticeDTO) {
		Optional<Notice> result = noticeRepository.findById(noticeDTO.getNoticeId());
		Notice notice = result.orElseThrow();
		notice.changeContent(noticeDTO.getContent());
		notice.changeTitle(noticeDTO.getTitle());

		noticeRepository.save(notice);
	}

	@Override
	public void remove(Long noticeId) {
		noticeRepository.updateToDelete(noticeId, true);
	}

}
