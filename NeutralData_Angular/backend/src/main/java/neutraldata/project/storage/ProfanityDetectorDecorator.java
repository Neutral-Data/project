package neutraldata.project.storage;

public class ProfanityDetectorDecorator implements Detector {
    private final Detector decoratedDetector;
    private final StorageService storageService;
    public ProfanityDetectorDecorator(Detector decoratedDetector,StorageService storageService) {
        this.decoratedDetector = decoratedDetector;
        this.storageService = storageService;
    }

    @Override
    public String detect(String filename) {
        return decoratedDetector.detect(filename) + storageService.checkProfanity(filename,"profanity.csv");
    }
}