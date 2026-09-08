package com.imm.springai;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Streams the entire project as a ZIP file for download.
 *
 * Excludes:
 *   - .git, build/, .gradle/, node_modules/, dist/
 *   - .tsbuildinfo, .lock files
 * See Spring AI reference: "Project Structure" section.
 */
@RestController
class DownloadController {

    private static final String EXCLUDE_PREFIX = ".git" + File.separator;

    /**
     * @return the entire project as a ZIP file for download
     * See Spring AI reference: "Project Structure" section
     */
    @GetMapping("/download")
    ResponseEntity<byte[]> download() {
        try {
            byte[] zip = buildZip();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"springai-tour.zip\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(zip.length)
                    .body(zip);
        } catch (IOException e) {
            throw new RuntimeException("Failed to build ZIP", e);
        }
    }

    private byte[] buildZip() throws IOException {
        Path root = new File(".").toPath();
        Path zipFile = Files.createTempFile("springai-tour", ".zip");
        try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(zipFile))) {
            addDirectoryToZip(zos, root, "");
        }
        return Files.readAllBytes(zipFile);
    }

    private void addDirectoryToZip(ZipOutputStream zos, Path base, String prefix) throws IOException {
        File dir = base.toFile();
        File[] files = dir.listFiles();
        if (files == null) return;

        for (File file : files) {
            String name = file.getName();
            String entryName = prefix.isEmpty() ? name : prefix + "/" + name;

            // Skip excluded directories and build artifacts
            if (shouldExclude(name)) continue;

            if (file.isDirectory()) {
                addDirectoryToZip(zos, file.toPath(), entryName);
            } else {
                // Skip large files (node_modules, .git, build)
                if (Files.isDirectory(file.toPath())) continue;
                if (file.length() > 50 * 1024 * 1024) continue; // skip > 50MB
                zos.putNextEntry(new ZipEntry(entryName));
                Files.copy(file.toPath(), zos);
                zos.closeEntry();
            }
        }
    }

    private boolean shouldExclude(String name) {
        return name.equals(".git")
                || name.equals("build")
                || name.equals(".gradle")
                || name.equals("node_modules")
                || name.equals("dist")
                || name.equals(".tsbuildinfo")
                || name.equals(".gitignore")
                || name.equals(".gitattributes");
    }
}