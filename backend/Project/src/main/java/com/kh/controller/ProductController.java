박찬희
bhnanpdltl53
자리 비움

김화랑 — 2025-08-06 오전 11:07
만들어야되는 페이지
메인, 헤더, 푸터,  -> 나
로그인, 회원가입 -> 기훈이형
장바구니 리스트 페이지
결제 페이지 (카카오결제API) -> 나
브랜드 별 상품 리스트, 상품 상세페이지(리뷰) -> 나 
공지사항 리스트, 공지사항 상세페이지 -> 관리자만 작성 댓글 X 
질의응답 리스트, 질의응답 상세페이지 -> 사ㅇ용자 작성 관리자 댓글 
마이페이지, 찜목록 리스트
차기 — 2025-08-06 오후 12:19
이미지
이미지
김화랑 — 2025-08-06 오후 12:24
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
const Footer = () => {
  return (
    <>
      <footer className="py-5 bg-dark">
확장
Footer.jsx
1KB
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
const Header = () => {
  return (
    <>
      {/* 상단 네비게이션 바 */}
확장
Header.jsx
4KB
@charset "UTF-8";
/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/... (187KB 남음)
확장
App.css
237KB
박찬희 — 2025-08-06 오후 3:09
gpt 수준;
이미지
차기 — 2025-08-06 오후 3:11
이미지
이미지
이미지
이미지
박찬희 — 2025-08-06 오후 4:11
첨부 파일 형식: acrobat
part01깃환경설정하기.pdf
2.06 MB
차기 — 2025-08-07 오후 12:24
이미지
이미지
차기 — 2025-08-07 오후 2:15
이미지
이미지
차기 — 2025-08-07 오후 2:32
이미지
이미지
김화랑 — 2025-08-07 오후 4:50
import { useEffect, useState } from "react";
import "../../App.css";
import ProductCarousel from "../../include/ProductCarousel";
import { getOne } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/productApi";
const initState = {
확장
message.txt
8KB
박찬희 — 2025-08-08 오전 9:09
이미지
차기 — 2025-08-08 오전 11:35
/* 컨테이너: 화면 중앙 정렬 및 배경 */
.login-container {
  background-color: white;
  flex: 1; /* ✅ 메인 콘텐츠 영역이 남은 공간 차지 */
  display: flex;
  justify-content: center;
확장
message.txt
3KB
/* 컨테이너: 화면 중앙 정렬 및 배경 */
.register-container {
  background-color: white;
  flex: 1; /* ✅ 레이아웃에서 남은 공간만큼 차지 */
  display: flex;
  justify-content: center;
확장
message.txt
4KB
1.login 2.회원가입
호준 — 2025-08-11 오전 10:32
https://docs.google.com/spreadsheets/d/1mgmJ7yspPRBhrsDC4P5fX09NI2_7QFDDrrU8d3gNtfE/edit?gid=0#gid=0
박찬희 — 2025-08-12 오후 12:03
@Column(nullable = false)
    private boolean delFlag;
차기 — 2025-08-12 오후 12:08
import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080/";
const prefix = ${API_SERVER_HOST}/api/notice;

export const getNoticeList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(${prefix}/list, {
    params: { page, size },
  });
  return res.data;
};

export const getNotice = async (id) => {
  const res = await jwtAxios.get(${prefix}/${id});
  return res.data;
};

export const postNotice = async (noticeData) => {
  const res = await jwtAxios.post(${prefix}, noticeData);
  return res.data;
};

export const modifyNotice = async (id, noticeData) => {
  const res = await jwtAxios.put(${prefix}/${id}, noticeData);
  return res.data;
};

export const deleteNotice = async (id) => {
  const res = await jwtAxios.delete(${prefix}/${id});
  return res.data;
};
------------------------------------------------------------
import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080/";
const prefix = ${API_SERVER_HOST}/api/notice;

export const getNoticeList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(${prefix}/list, {
    params: { page, size },
  });
  return res.data;
};

export const getNotice = async (id) => {
  const res = await axios.get(${prefix}/${id});
  return res.data;
};

export const postNotice = async (noticeData) => {
  const res = await jwtAxios.post(${prefix}, noticeData);
  return res.data;
};

export const modifyNotice = async (id, noticeData) => {
  const res = await jwtAxios.put(${prefix}/${id}, noticeData);
  return res.data;
};

export const deleteNotice = async (id) => {
  const res = await jwtAxios.delete(${prefix}/${id});
  return res.data;
};
박찬희 — 2025-08-12 오후 12:11
// 삭제되지 않은(delFlag = false) 공지사항 목록을 페이징 처리하여 조회
    // JPQL을 사용하여 Notice 엔티티를 직접 조회합니다.
    @Query("SELECT n FROM Notice n WHERE n.delFlag = false ORDER BY n.noticeId DESC")
    Page<Notice> findAllNotDeleted(Pageable pageable);
차기 — 2025-08-12 오후 12:15
noticeApi.jsx:9 
 GET http://localhost:8080/api/notice/list?page=1&size=10 500 (Internal Server Error)

axios.js?v=b670c721:1253 Uncaught (in promise) 
AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
김화랑 — 2025-08-12 오후 3:37
private final JWTCheckFilter jwtCheckFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("-------------------- security config ---------------------------------------");

        http.csrf(config -> config.disable())
                .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(config -> config.configurationSource(corsConfigurationSource()))
                // 💡 formLogin() 설정을 유지하고, 성공/실패 핸들러를 지정합니다.
                .formLogin(config -> {
                    config.loginPage("/api/member/login");
                    config.successHandler(new APILoginSuccessHandler());
                }).authorizeHttpRequests(config -> {
                    config.requestMatchers("/swagger-ui/", "/v3/api-docs/", "/api/member/login",
                            "/api/member/signup").permitAll().requestMatchers("/api/member/me").authenticated()
                            .anyRequest().permitAll();
                })
                // JWTCheckFilter를 UsernamePasswordAuthenticationFilter 이전에 추가
                .addFilterBefore(jwtCheckFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
package com.kh.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
확장
message.txt
4KB
김화랑 — 2025-08-13 오후 5:41
이미지
차기 — 2025-08-14 오후 4:24
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotice, deleteNotice, modifyNotice } from "../../api/noticeApi"; // 실제 API 호출 함수
import { useSelector } from "react-redux";
import "./ReadComponent.css";
확장
message.txt
3KB
김화랑 — 2025-08-14 오후 4:48
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { useSelector } from "react-redux";
import useCustomLogin from "../hook/useCustomLogin";
const Header = () => {
  const loginState = useSelector((state) => state.login);
확장
message.txt
5KB
박찬희 — 2025-08-14 오후 5:22
package com.kh.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

/** QUESTION 테이블 – 요구된 컬럼만 사용 */
@Entity
@Table(name = "tbl_question")
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QUESTION_ID")
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private Member userId;

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Lob
    @Column(name = "CONTENT", nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    // 💡 ENUM 타입을 사용하도록 필드 수정
    @Enumerated(EnumType.STRING) // 💡 데이터베이스에 문자열로 저장
    private QuestionStatus status;

}
package com.kh.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "ANSWER")
@SequenceGenerator(name = "ANSWER_SEQ_GEN", sequenceName = "ANSWER_SEQ", allocationSize = 1)
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"questionId", "admin"})
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ANSWER_SEQ_GEN")
    @Column(name = "ANSWER_ID")
    private Long answerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "QUESTION_ID") // PK 참조라 referencedColumnName 생략 OK
    private Question questionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ADMIN_USER_ID", referencedColumnName = "USERID") // ★ 조인 기준: TBL_MEMBER.USERID
    private Member admin;

    @Column(name = "CONTENT", nullable = false, length = 4000)
    private String content;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDate createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDate  updatedAt;



    @PrePersist
    void prePersist() {
        this.createdAt = LocalDate.now();
        this.updatedAt = this.createdAt;
    }

    public void changeContent(String content) {
        this.content = content;
        this.updatedAt = LocalDate.now();
    }

}
박찬희 — 2025-08-14 오후 5:31
@Override
    public void update(Long qid, String userId, QuestionDTO dto) throws NotFoundException {
        Question q = questionRepo.findById(qid).orElseThrow(NotFoundException::new);
        // 사용자 ID 비교
        if (!q.getUserId().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }
        // 질문 상태 확인
        if (q.getStatus() != QuestionStatus.WAITING) {
            throw new ConflictException("수정할 수 없는 상태입니다.");
        }
        // 제목 및 내용 업데이트
        q.setTitle(dto.getTitle());
        q.setContent(dto.getContent());
        questionRepo.save(q); // ✅ 변경 사항을 저장
    }
박찬희 — 2025-08-14 오후 5:47
/** 작성 */
    @PostMapping("/")
    public ResponseEntity<?> create(@RequestBody QuestionDTO questionDTO,
            @AuthenticationPrincipal MemberDTO memberDTO) {
        questionDTO.setUserId(memberDTO.getUserId());
        Long id = service.create(cur.id(), questionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", id));
    }
박찬희 — 2025-08-18 오전 9:09
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
김화랑 — 어제 오전 11:23
import { getList } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/productApi";
import { useEffect, useState } from "react";
import useCustomMove from "../../hook/useCustomMove";

const host = API_SERVER_HOST;
확장
message.txt
7KB
import Header from "../include/Header";
import Footer from "../include/Footer";
import "../App.css";
import Carousel from "../include/BannerCarousel";
import banner from "../assets/banner.jpg";
const MainPage = () => {
확장
message.txt
9KB
김화랑 — 어제 오후 12:15
기획서 => O
사용자 관리자요구사항 => O

테이블 명세서 => 화랑


개체관계도 => 해야됌
논리적 구조도 => 해야됌
물리적 구조도 => 해야됌
Diagram => 해야됌 

사용자, 관리자 레이아웃 지금까지한 페이지 캡처 => 호준이형 
일정관리 => 기훈이형
박찬희 — 어제 오후 12:19
이미지
차기 — 어제 오후 12:50
첨부 파일 형식: acrobat
perfume_schedule_wbs_gantt_onepage_v15.pdf
21.10 KB
김화랑 — 어제 오후 2:21
화면, 기능, DB 설계 ->  8월4일 ~ 8월 8일
백엔드 구현 -> 백엔드 -> 8월 9일 ~ 8월 22일
프론트엔드 구현 -> 프론트엔드 -> 8월 9일 ~ 8월 22일
연동 테스트 -> 둘다 8월 13일 ~ 22일
통합 검증 및 오류 수정 -> 22일 ~ 25일
최종 시스템 테스트 -> 25일 ~ 28일
차기 — 어제 오후 2:30
첨부 파일 형식: acrobat
perfume_schedule_wbs_gantt_onepage_v17.pdf
20.28 KB
박찬희 — 어제 오후 2:30
이미지
박찬희 — 어제 오후 2:42
이미지
박찬희 — 어제 오후 2:56
이미지
박찬희 — 어제 오후 3:11
첨부 파일 형식: unknown
팀플.DRAWIO
70.53 KB
호준 — 어제 오후 3:15
dd
첨부 파일 형식: acrobat
사용자,관리자레이아웃.pdf
208.12 KB
차기 — 어제 오후 3:31
// 답변 등록/수정 (서버 컨트롤러 규약: content 키 사용)
  const handleAnswerSubmit = async () => {
    const body = answerText.trim();
    if (!body) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      if (qna.answer?.trim()) {
        // 수정
        if (!qna.answerId) {
          alert(
            "answerId가 없습니다. 단건 조회 응답에 answerId를 포함해 주세요."
          );
        } else {
          await updateAnswer(qna.answerId, { content: body }); // PUT /api/answers/{answerId}
          alert("답변이 수정되었습니다.");
        }
      } else {
        // 등록
        await createAnswer({ questionId: qnaId, content: body }); // POST /api/answers/
        alert("답변이 등록되었습니다.");
      }

      await fetchQna();
      setIsAnswering(false);
      setAnswerText("");
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message 
        e?.response?.data?.error 
        "답변 등록/수정에 실패했습니다.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };
------------------------------------------------------------------
@GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> read(@PathVariable Long id) {
        QuestionDTO q = questionService.read(id);

        // 답변이 있으면 끼워넣기
        answerRepository.findByQuestionId_QuestionId(id)
                .map(a -> AnswerDTO.builder()
                        .answerId(a.getAnswerId())
                        .questionId(a.getQuestionId().getQuestionId())
                        .userId(a.getAdmin().getUserId())
                        .adminName(a.getAdmin().getName())
                        .content(a.getContent())
                        .createdAt(a.getCreatedAt())
                        .updatedAt(a.getUpdatedAt())
                        .build()).ifPresent(q::setAnswer);

        return ResponseEntity.ok(q);
    }
호준 — 어제 오후 3:37
첨부 파일 형식: acrobat
Presentation 1.pdf
199.50 KB
첨부 파일 형식: acrobat
사용자,관리자 레이아웃.pdf
199.57 KB
박찬희 — 어제 오후 3:41
List<AnswerDTO> answers = answerRepository.findByQuestionId(id)
        .stream()
        .map(a -> AnswerDTO.builder()
            // 답변 DTO 필드 설정
            .answerId(a.getAnswerId())
            .content(a.getContent())
            // ...
            .build())
        .collect(Collectors.toList());

    // QuestionDTO에 답변 목록 설정
    q.setAnswers(answers);
김화랑 — 어제 오후 4:47
최종본 입니당
첨부 파일 형식: archive
1팀_김화랑.zip
407.30 KB
김화랑 — 오전 10:14
첨부 파일 형식: acrobat
테이블 명세서.pdf
256.27 KB
김화랑 — 오전 10:29
첨부 파일 형식: archive
1팀_김화랑.zip
528.76 KB
김화랑 — 오후 6:44
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>
<parent>
확장
message.txt
6KB
차기 — 오후 6:50
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
김화랑 — 오후 7:03
package com.kh.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ProductDTO;
import com.kh.service.ProductService;
import com.kh.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/product")
public class ProductController {

private final ProductService productService;
private final CustomFileUtil fileUtil;

@PostMapping("/")
// multipart/form-data 요청에서 JSON(또는 다른 미디어 타입) 파트를 객체로 변환해서 받음
public Map<String, Long> register(@RequestPart("productDTO") ProductDTO productDTO,
@RequestPart("files") List<MultipartFile> files) {

log.info("Received productDTO: {}", productDTO);
log.info("Received files: {}", files);

// 파일 저장
List<String> uploadFileNames = fileUtil.saveFiles(files);
productDTO.setUploadFileNames(uploadFileNames);

// 상품 등록
Long pno = productService.register(productDTO);

return Map.of("result", pno);
}

@GetMapping("/view/{fileName}")
public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
return fileUtil.getFile(fileName);
}

//@PreAuthorize("hasRole('ROLE_ADMIN')") 
@GetMapping("/list")
public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO) {
log.info("list............." + pageRequestDTO);
return productService.list(pageRequestDTO);
}

@GetMapping("/{pno}")
public ProductDTO read(@PathVariable(name = "pno") Long pno) {
return productService.get(pno);
}

@PutMapping("/{pno}")
public Map<String, String> modify(@PathVariable Long pno, @RequestPart("productDTO") ProductDTO productDTO,
@RequestPart(value = "files", required = false) List<MultipartFile> files) {
productDTO.setPno(pno);
ProductDTO oldProductDTO = productService.get(pno);
List<String> oldFileNames = oldProductDTO.getUploadFileNames(); // 기존 파일
List<String> currentUploadFileNames = fileUtil.saveFiles(files); // 새 업로드된 파일들
List<String> uploadedFileNames = productDTO.getUploadFileNames(); // 유지된 파일들 (클라이언트에서 전달됨)
if (currentUploadFileNames != null && !currentUploadFileNames.isEmpty()) {
uploadedFileNames.addAll(currentUploadFileNames); // 유지 + 신규 업로드된 파일 합치기
}
productDTO.setUploadFileNames(uploadedFileNames); // 최종 저장할 파일 목록으로 설정
// 실제 DB 수정
productService.modify(productDTO);
// 삭제할 파일 식별
List<String> removeFiles = oldFileNames.stream().filter(name -> !uploadedFileNames.contains(name)).toList();
fileUtil.deleteFiles(removeFiles); // 삭제

return Map.of("RESULT", "SUCCESS");
}

@DeleteMapping("/{pno}")
public Map<String, String> remove(@PathVariable("pno") Long pno) {
// 삭제해야 할 파일들 알아내기
List<String> oldFileNames = productService.get(pno).getUploadFileNames();
productService.remove(pno);
fileUtil.deleteFiles(oldFileNames);
return Map.of("RESULT", "SUCCESS");
}
... (1줄 남음)
접기
message.txt
4KB
﻿
package com.kh.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ProductDTO;
import com.kh.service.ProductService;
import com.kh.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/product")
public class ProductController {

	private final ProductService productService;
	private final CustomFileUtil fileUtil;

	@PostMapping("/")
	// multipart/form-data 요청에서 JSON(또는 다른 미디어 타입) 파트를 객체로 변환해서 받음
	public Map<String, Long> register(@RequestPart("productDTO") ProductDTO productDTO,
			@RequestPart("files") List<MultipartFile> files) {

		log.info("Received productDTO: {}", productDTO);
		log.info("Received files: {}", files);

		// 파일 저장
		List<String> uploadFileNames = fileUtil.saveFiles(files);
		productDTO.setUploadFileNames(uploadFileNames);

		// 상품 등록
		Long pno = productService.register(productDTO);

		return Map.of("result", pno);
	}

	@GetMapping("/view/{fileName}")
	public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
		return fileUtil.getFile(fileName);
	}

//	@PreAuthorize("hasRole('ROLE_ADMIN')") 
	@GetMapping("/list")
	public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO) {
		log.info("list............." + pageRequestDTO);
		return productService.list(pageRequestDTO);
	}

	@GetMapping("/{pno}")
	public ProductDTO read(@PathVariable(name = "pno") Long pno) {
		return productService.get(pno);
	}

	@PutMapping("/{pno}")
	public Map<String, String> modify(@PathVariable Long pno, @RequestPart("productDTO") ProductDTO productDTO,
			@RequestPart(value = "files", required = false) List<MultipartFile> files) {
		productDTO.setPno(pno);
		ProductDTO oldProductDTO = productService.get(pno);
		List<String> oldFileNames = oldProductDTO.getUploadFileNames(); // 기존 파일
		List<String> currentUploadFileNames = fileUtil.saveFiles(files); // 새 업로드된 파일들
		List<String> uploadedFileNames = productDTO.getUploadFileNames(); // 유지된 파일들 (클라이언트에서 전달됨)
		if (currentUploadFileNames != null && !currentUploadFileNames.isEmpty()) {
			uploadedFileNames.addAll(currentUploadFileNames); // 유지 + 신규 업로드된 파일 합치기
		}
		productDTO.setUploadFileNames(uploadedFileNames); // 최종 저장할 파일 목록으로 설정
		// 실제 DB 수정
		productService.modify(productDTO);
		// 삭제할 파일 식별
		List<String> removeFiles = oldFileNames.stream().filter(name -> !uploadedFileNames.contains(name)).toList();
		fileUtil.deleteFiles(removeFiles); // 삭제

		return Map.of("RESULT", "SUCCESS");
	}

	@DeleteMapping("/{pno}")
	public Map<String, String> remove(@PathVariable("pno") Long pno) {
		// 삭제해야 할 파일들 알아내기
		List<String> oldFileNames = productService.get(pno).getUploadFileNames();
		productService.remove(pno);
		fileUtil.deleteFiles(oldFileNames);
		return Map.of("RESULT", "SUCCESS");
	}
}