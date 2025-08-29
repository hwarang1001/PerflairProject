package com.kh.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.gson.Gson;
import com.kh.domain.Member;
import com.kh.dto.MemberDTO;
import com.kh.repository.MemberRepository;
import com.kh.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2

@RequiredArgsConstructor
public class JWTCheckFilter extends OncePerRequestFilter {

	private static final List<String> EXCLUDE_URLS = List.of("/api/product/list", "/api/member/login",
			"/api/member/register");

	private final MemberRepository memberRepository;
	private final JWTUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String path = request.getRequestURI();
		log.info("JWTCheckFilter 실행: {}", path);
		log.info("현재 인증 상태: {}", SecurityContextHolder.getContext().getAuthentication());

		// Authorization 헤더를 가져온다.
		String authHeaderStr = request.getHeader("Authorization");
		log.info("Authorization Header: " + authHeaderStr);

		// ⭐️ 수정된 부분: 헤더가 null이거나 'Bearer '로 시작하지 않으면, 다음 필터로 넘긴다.
		// 이렇게 하면 헤더가 없는 요청은 인증이 필요한 곳에서 처리된다.
		// ⭐️ 수정된 부분: 헤더가 없거나 'Bearer '로 시작하지 않으면, 다음 필터로 넘긴다.
		if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			// 'Bearer ' 부분을 제외한 토큰만 추출
			String accessToken = authHeaderStr.substring(7);
			Map<String, Object> claims = JWTUtil.validateToken(accessToken);
			log.info("!!!!!!!!!!!!!!!JWT claims: " + claims);

			String userId = (String) claims.get("userId");

			Optional<Member> memberOptional = memberRepository.findById(userId);

			if (!memberOptional.isPresent()) {
				log.warn("DB에서 회원을 찾지 못했습니다. 요청된 ID: " + userId);
				throw new IllegalArgumentException("회원이 존재하지 않습니다.");
			}
			String name = (String) claims.get("name");

			String address = (String) claims.getOrDefault("address", "");
			String phoneNum = (String) claims.getOrDefault("phoneNum", "");
			Boolean social = (Boolean) claims.getOrDefault("social", false);
			List<String> roleNames = (List<String>) claims.get("roleNames");

			MemberDTO memberDTO = new MemberDTO(userId, "", name, phoneNum, social.booleanValue(), roleNames);

			UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(memberDTO,
					null, memberDTO.getAuthorities());

			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
			try {
				log.info(memberDTO);
				log.info(memberDTO.getAuthorities());
			} catch (Exception e) {
				log.error("로그 출력 중 에러 발생: " + e.getMessage(), e);
			}

			filterChain.doFilter(request, response);

		} catch (Exception e) {
			log.error("JWT Check Error .................................... ");
			log.error(e.getMessage());
			Gson gson = new Gson();
			String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

			response.setContentType("application/json");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized

			PrintWriter printWriter = response.getWriter();
			printWriter.println(msg);
			printWriter.close();
		}
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		// Preflight (지금 보내는 요청이 유효한지를 확인하기 위해 OPTIONS
		// 메서드로 예비 요청을 보내는 것
		if (request.getMethod().equals("OPTIONS")) {
			return true;
		}

		String path = request.getRequestURI();
		log.info("check uri. .............. " + path);
		// 이미지 조회 경로는 체크하지 안하고 싶을 때
		if (path.startsWith("/api/product/view/")) {
			return true;
		}
		if (path.startsWith("/api/member/login") || path.startsWith("/api/member/register")) {
			return true;
		}
		if (path.startsWith("/api/member/signup")) {
			return true;
		}
		if (path.startsWith("/api/notice/")) {
			return true;
		}
		
		return false;
	}

}
