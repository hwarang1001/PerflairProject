package com.kh.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = { "member","product", "imageList" })
    @Query("select r from Review r where r.reviewId = :reviewId")
    Optional<Review> selectOne(@Param("reviewId") Long reviewId);

    @Query("select r, ri from Review r left join r.imageList ri where ri.ord = 0")
    Page<Object[]> selectList(Pageable pageable);
}
