package com.kh.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.gson.Gson;
import com.kh.dto.MemberDTO;
import com.kh.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		log.info("--------------------  JWTCheckFilter ------------------------------------------------------ ");
		String authHeaderStr = request.getHeader("Authorization");
		try {
			// Bearer accestoken ............... 토큰이 정상적이면 그대로 요구사항진행
			String accessToken = authHeaderStr.substring(7);
			Map<String, Object> claims = JWTUtil.validateToken(accessToken);
			log.info("JWT claims: " + claims);
			// filterChain.doFilter(request, response); //이하 추가
			String userId = (String) claims.get("userId");
			String name = (String) claims.get("name");
			// 🔑 JWT 클레임에 없는 필드에 대해 null 대신 기본값 설정
		    String address = (String) claims.getOrDefault("address", "");
		    String phoneNum = (String) claims.getOrDefault("phoneNum", "");
		    Boolean social = (Boolean) claims.getOrDefault("social", false);
			List<String> roleNames = (List<String>) claims.get("roleNames");
			MemberDTO memberDTO = new MemberDTO(userId, "", name,address,phoneNum, social.booleanValue(), roleNames);
			log.info(" ----------------------------------------------------------------- ");
			log.info(memberDTO);
			log.info(memberDTO.getAuthorities());
			// 스프링 시큐리티에서 인증 정보를 담는 객체
			UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(memberDTO,
					null, memberDTO.getAuthorities());
			// 이 객체를 SecurityContextHolder에 넣으면,
			// 해당 요청은 인증된 사용자로 처리됨
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
			filterChain.doFilter(request, response);
		} catch (Exception e) {
			log.error("JWT Check Error .................................... ");
			log.error(e.getMessage());
			Gson gson = new Gson();
			String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
			response.setContentType("application/json");
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
		// api/member/ 경로의 호출은 체크하지 않음
		if (path.startsWith("/api/member/")) {
			return true;
		}
		// 이미지 조회 경로는 체크하지 않하고 싶을 때
		if (path.startsWith("/api/products/view/")) {
			return true;
		}
		
		// 테스트용 권한X
		if (path.startsWith("/api/product/")) {
			return true;
		}
		return false;
	}

}
