package com.placementintelligence.service;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface FileStorageService {

    String storeResume(MultipartFile file);

    void deleteResume(String fileUrl);

    Path getResume(String fileUrl);
}
