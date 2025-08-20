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