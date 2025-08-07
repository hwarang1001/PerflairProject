package com.kh.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(name = "NOTICE_SEQ_GEN", sequenceName = "NOTICE_SEQ", allocationSize = 1)
public class Notice {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "NOTICE_SEQ_GEN")
	private Long noticeId;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String content;

	@Column(name = "created_at", updatable = false) // 생성 후 변경 불가하도록 설정
	private LocalDateTime createdAt;

	@Column(name = "update_at")
	private LocalDateTime updateAt;

	@Column(nullable = false, columnDefinition = "NUMBER(1,0) default 0")
	private boolean delFlag;

	public void changeDel(boolean delFlag) {
		this.delFlag = delFlag;
	}

	public void changeTitle(String title) {
		this.title = title;
	}

	public void changeContent(String content) {
		this.content = content;
	}

	// 엔티티가 처음 생성될 때 호출됩니다.
	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
		this.updateAt = this.createdAt; // 생성 시 updateAt도 동일하게 초기화
	}

	// 엔티티가 업데이트될 때 호출됩니다.
	@PreUpdate
	public void preUpdate() {
		this.updateAt = LocalDateTime.now();
	}
}
