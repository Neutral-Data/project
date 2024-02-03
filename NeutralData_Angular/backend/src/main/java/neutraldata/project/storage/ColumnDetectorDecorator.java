package neutraldata.project.storage;

public class ColumnDetectorDecorator implements Detector {
    private final Detector decoratedDetector;
    private final StorageService storageService;
    public ColumnDetectorDecorator(Detector decoratedDetector,StorageService storageService) {
        this.decoratedDetector = decoratedDetector;
        this.storageService = storageService;
    }

    @Override
    public String detect(String filename) {
        return decoratedDetector.detect(filename) + storageService.checkFirstRow(filename);
    }
}