package com.placementintelligence.service.impl;

import com.placementintelligence.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    @Override
    public Path getResume(String fileUrl) {

        if (fileUrl == null || fileUrl.isBlank()) {
            throw new IllegalArgumentException(
                "Resume file path is required"
            );
        }

        Path filePath = Paths.get(fileUrl)
            .toAbsolutePath()
            .normalize();

        if (!Files.exists(filePath)) {
            throw new RuntimeException(
                "Resume file not found"
            );
        }

        return filePath;
    }

    private final Path resumeStorageLocation;

    public LocalFileStorageService(
        @Value("${app.file-storage.resume-directory:uploads/resumes}")
        String resumeDirectory) {

        this.resumeStorageLocation =
            Paths.get(resumeDirectory)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.resumeStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException(
                "Could not create resume storage directory",
                e
            );
        }
    }

    @Override
    public String storeResume(MultipartFile file) {

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null ||
            originalFileName.isBlank()) {

            throw new RuntimeException(
                "Invalid resume file name"
            );
        }

        String extension = getExtension(originalFileName);

        String storedFileName =
            UUID.randomUUID() + extension;

        Path targetLocation =
            resumeStorageLocation.resolve(storedFileName);

        try {

            Files.copy(
                file.getInputStream(),
                targetLocation,
                StandardCopyOption.REPLACE_EXISTING
            );

        } catch (IOException e) {

            throw new RuntimeException(
                "Failed to store resume",
                e
            );
        }

        return targetLocation.toString();
    }

    @Override
    public void deleteResume(String fileUrl) {

        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {

            Path filePath = Paths.get(fileUrl);

            Files.deleteIfExists(filePath);

        } catch (IOException e) {

            throw new RuntimeException(
                "Failed to delete resume file",
                e
            );
        }
    }

    private String getExtension(String fileName) {

        int lastDot = fileName.lastIndexOf('.');

        if (lastDot == -1) {
            return "";
        }

        return fileName.substring(lastDot).toLowerCase();
    }
}
