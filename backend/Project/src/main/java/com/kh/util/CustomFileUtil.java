package com.kh.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {
	@Value("${com.kh.upload.path}")
	private String uploadPath;
	@PostConstruct
	public void init() {
		File tempFolder = new File(uploadPath);
		if (tempFolder.exists() == false) {
			tempFolder.mkdir();
		}
		uploadPath = tempFolder.getAbsolutePath();
		log.info(" ");
		log.info(uploadPath);
	}
	public List<String> saveFiles(List<MultipartFile> files) throws RuntimeException {
		if (files == null || files.size() == 0) {
			return new ArrayList<>();
		}
		List<String> uploadNames = new ArrayList<>();

		for (MultipartFile multipartFile : files) {
			String savedName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
			// savePath = C:/SpringBootProject/workspace/mallapi/upload/UUID_pch.jpg
			Path savePath = Paths.get(uploadPath, savedName);
			try {
			    log.info("Saving file: " + savedName + ", size: " + multipartFile.getSize());
			    Files.copy(multipartFile.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
			    log.info("File saved to: " + savePath.toAbsolutePath());

			    String contentType = multipartFile.getContentType();
			    if (contentType != null && contentType.startsWith("image")) {
			        Path thumbnailPath = Paths.get(uploadPath, "s_" + savedName);
			        Thumbnails.of(savePath.toFile()).size(200, 200).toFile(thumbnailPath.toFile());
			        log.info("Thumbnail created: " + thumbnailPath.toAbsolutePath());
			    }
			    log.info("Content type: " + contentType);
			    uploadNames.add(savedName);
			} catch (IOException e) {
			    log.error("File save or thumbnail creation error for file: " + savedName, e);
			    throw new RuntimeException(e);
			}
		} // end for
			// List <String> uploadnames
		return uploadNames;
	}
	public ResponseEntity<Resource> getFile(String fileName) {
		Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
		log.info(resource.exists());
		if (!resource.exists()) {
			resource = new FileSystemResource(uploadPath + File.separator + "default.jpg");
		}

		HttpHeaders headers = new HttpHeaders();
		try {
			headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}

		return ResponseEntity.ok().headers(headers).body(resource);
	}

	public void deleteFiles(List<String> fileNames) {
		if (fileNames == null || fileNames.size() == 0) {
			return;
		}
		fileNames.forEach(fileName -> {
			// 썸네일이 있는지 확인하고 삭제
			String thumbnailFileName = "s_" + fileName;
			Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName);
			Path filePath = Paths.get(uploadPath, fileName);
			try {
				Files.deleteIfExists(filePath);
				Files.deleteIfExists(thumbnailPath);
			} catch (IOException e) {
				throw new RuntimeException(e.getMessage());
			}
		});
	}
}
