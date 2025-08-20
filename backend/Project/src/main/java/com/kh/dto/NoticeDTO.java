package com.kh.dto;


import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeDTO {
	
	private Long noticeId;
    private String title;
    private String content;
    private LocalDate createdAt;
    private LocalDate updateAt;
    private boolean delFlag;
    
}
