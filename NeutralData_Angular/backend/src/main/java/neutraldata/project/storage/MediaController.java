package neutraldata.project.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import neutraldata.project.exception.FileNotFoundException;

@RestController
@RequestMapping("media")
@AllArgsConstructor
public class MediaController {

    private final StorageService storageService;
    private final HttpServletRequest request;

    @PostMapping("upload")
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile multipartFile,
            @RequestParam(value = "customTerms", required = false) String customTerms) {
        String path = storageService.store(multipartFile);
        String host = request.getRequestURL().toString().replace(request.getRequestURI(), "");
        String url = ServletUriComponentsBuilder
                .fromHttpUrl(host)
                .path("/media/")
                .path(path)
                .toUriString();
        String ownTermsFile = "None";
        if (customTerms != null && !customTerms.isEmpty()) {
            try {
                ownTermsFile = storageService.storeText(customTerms);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return Map.of("url", url, "terms", ownTermsFile);
    }

    @GetMapping("{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
        Resource file = storageService.loadAsResource("new_" + filename);
        if (file == null || !file.exists()) {
            throw new FileNotFoundException("File not found: " + filename);
        }
        String contentType = Files.probeContentType(file.getFile().toPath());

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(file);
    }

    @GetMapping("{filename:.+}/detection")
    public ResponseEntity<String> getDetection(
            @PathVariable String filename,
            @RequestParam(required = false, defaultValue = "false") boolean detectColumns,
            @RequestParam(required = false, defaultValue = "false") boolean detectRows,
            @RequestParam(required = false, defaultValue = "false") boolean detectProfanity,
            @RequestParam(required = false, defaultValue = "false") boolean ownTerms,
            @RequestParam(value = "ownTermsName", required = false) String ownTermsName) {

        Detector baseDetector = new BaseDetector(storageService);

        if (detectColumns) {
            baseDetector = new ColumnDetectorDecorator(baseDetector, storageService);
        }
        if (detectRows) {
            baseDetector = new RowDetectorDecorator(baseDetector, storageService);
        }
        if (detectProfanity) {
            baseDetector = new ProfanityDetectorDecorator(baseDetector, storageService);
        }

        if (ownTerms && ownTermsName != null && !ownTermsName.isEmpty()) {
            baseDetector = new OwnTermsDetectorDecorator(baseDetector, storageService, ownTermsName);
        }

        String detectionInfo = baseDetector.detect(filename);

        return ResponseEntity.ok(detectionInfo);
    }

    @DeleteMapping("{filename:.+}")
    public ResponseEntity<String> deleteFile(@PathVariable String filename,
            @RequestParam(value = "ownTermsName", required = false) String ownTermsName) {
        boolean deleted = storageService.deleteFile(filename);
        if (ownTermsName != null && !ownTermsName.isEmpty()) {
            storageService.deleteFile(ownTermsName);
        }

        if (deleted) {
            return ResponseEntity.ok("File deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not delete file");
        }
    }
}
