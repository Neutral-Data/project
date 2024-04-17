package neutraldata.project.storage;

public class OwnTermsDetectorDecorator implements Detector {
    private final Detector decoratedDetector;
    private final StorageService storageService;
    private final String ownTermsName;
    public OwnTermsDetectorDecorator(Detector decoratedDetector,StorageService storageService, String ownTermsName) {
        this.decoratedDetector = decoratedDetector;
        this.storageService = storageService;
        this.ownTermsName = ownTermsName;
    }

    @Override
    public String detect(String filename) {
        return decoratedDetector.detect(filename) + storageService.checkOwnTerms(filename,ownTermsName);
    }
}
