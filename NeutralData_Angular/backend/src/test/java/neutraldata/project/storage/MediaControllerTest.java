package neutraldata.project.storage;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import neutraldata.project.exception.FileNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.nio.file.Files;

public class MediaControllerTest {

    @Mock
    private StorageService storageService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private MediaController mediaController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(mediaController).build();
    }

    @Test
	public void testUploadFile() throws Exception {
	
	    Resource resource = new FileSystemResource("mediafiles/Correo.csv");
	    MockMultipartFile file = new MockMultipartFile("file", resource.getFilename(), "text/csv", resource.getInputStream());
	
	    when(storageService.store(any())).thenReturn("path");
	    when(request.getRequestURL()).thenReturn(new StringBuffer("http://localhost:8080/media/upload"));
	    when(request.getRequestURI()).thenReturn("/media/upload");
	
	    mockMvc.perform(multipart("/media/upload").file(file))
	            .andExpect(status().isOk())
	            .andExpect(jsonPath("$.url").exists());
	
	    ArgumentCaptor<MultipartFile> fileCaptor = ArgumentCaptor.forClass(MultipartFile.class);
	    verify(storageService, times(1)).store(fileCaptor.capture());
	    assertEquals(file.getOriginalFilename(), fileCaptor.getValue().getOriginalFilename());
	    //
	    when(storageService.loadAsResource(any())).thenReturn(resource);

        mockMvc.perform(get("/media/{filename}", "Correo.csv"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel"))
                .andExpect(content().bytes(Files.readAllBytes(resource.getFile().toPath())));

        verify(storageService, times(1)).loadAsResource("new_Correo.csv");
	    
        //
        mockMvc.perform(get("/media/{filename}/detection", "Correo.csv")
                .param("detectColumns", "true")
                .param("detectRows", "false")
                .param("detectProfanity", "false"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andDo(result -> {
                    String content = result.getResponse().getContentAsString();
                    System.out.println(content);
                });
	}
    
    @Test
    public void testGetFile() throws Exception {
        Resource resource = new FileSystemResource("mediafiles/Correo.csv");

        when(storageService.loadAsResource(any())).thenReturn(resource);

        mockMvc.perform(get("/media/{filename}", "Correo.csv"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel"))
                .andExpect(content().bytes(Files.readAllBytes(resource.getFile().toPath())));

        verify(storageService, times(1)).loadAsResource("new_Correo.csv");
    }

    @Test
    public void testGetFileThrowsFileNotFoundException() throws Exception {
        when(storageService.loadAsResource(any())).thenReturn(null);

        try {
            mockMvc.perform(get("/media/{filename}", "Correo.csv"));
        } catch (Exception e) {
            if (!(e.getCause() instanceof FileNotFoundException)) {
                throw e;
            }
            if (!"File not found: Correo.csv".equals(e.getCause().getMessage())) {
                throw e;
            }
        }

        verify(storageService, times(1)).loadAsResource("new_Correo.csv");
    }
    

    @Test
    public void testGetDetection() throws Exception {
        Resource resource = new FileSystemResource("mediafiles/Correo.csv");      
        when(storageService.loadAsResource(any())).thenReturn(resource);
        mockMvc.perform(get("/media/{filename}/detection", "Correo.csv")
                .param("detectColumns", "true")
                .param("detectRows", "false")
                .param("detectProfanity", "false"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andDo(result -> {
                    String content = result.getResponse().getContentAsString();
                    System.out.println(content);
                });
    }
    
    @Test
    public void testDeleteFile() throws Exception {
        when(storageService.deleteFile(any())).thenReturn(true);

        mockMvc.perform(delete("/media/{filename}", "Correo.csv"))
                .andExpect(status().isOk())
                .andExpect(content().string("File deleted successfully"));

        verify(storageService, times(1)).deleteFile("Correo.csv");
    }
    
    @Test
    public void testDeleteFileNotFound() throws Exception {
        when(storageService.deleteFile(any())).thenReturn(false);

        mockMvc.perform(delete("/media/{filename}", "Correo.csv"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Could not delete file"));

        verify(storageService, times(1)).deleteFile("Correo.csv");
    }
}