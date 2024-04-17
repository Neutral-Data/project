package neutraldata.project.storage;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
	void init() throws IOException;
	
	String store(MultipartFile file);
	
	Resource loadAsResource(String filename);
	
	String checkFirstRow(String filename);
	
	String checkRows(String filename);
	
	String checkProfanity(String filename,String profanityFilename);
	
	String storeText(String content) throws IOException;
	
	String checkOwnTerms(String filename,String ownTermsName);
	
	boolean deleteFile(String filename);

}
