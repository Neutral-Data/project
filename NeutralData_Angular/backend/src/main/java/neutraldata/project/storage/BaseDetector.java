package neutraldata.project.storage;

public class BaseDetector implements Detector {
    private final StorageService storageService;

    public BaseDetector(StorageService storageService) {
        this.storageService = storageService;
    }

    @Override
    public String detect(String filename) {
        return " ";
        
    }
}