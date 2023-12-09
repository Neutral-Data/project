package neutraldata.project.storage;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import java.io.Writer;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.opencsv.exceptions.CsvException;

import io.dataapps.chlorine.finder.FinderEngine;
import jakarta.annotation.PostConstruct;
@Service
public class FileSystemStorageService implements StorageService {

    @Value("${media.location}")
    private String mediaLocation;

    private Path rootLocation;

    @Override
    @PostConstruct
    public void init() throws IOException {
        rootLocation = Paths.get(mediaLocation);
        Files.createDirectories(rootLocation);
    }

    @Override
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            Path destinationFile = rootLocation.resolve(Paths.get(uniqueFilename))
                    .normalize().toAbsolutePath();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource((file.toUri()));

            if (resource.exists() || resource.isReadable()) {
                if (filename.endsWith(".csv")) {
                    try (CSVReader reader = new CSVReader(Files.newBufferedReader(file))) {
                        List<String[]> lines = reader.readAll();

                        String firstRowCheck = checkFirstRow(filename);
                        if (lines.size() > 0) {
                            System.out.println(firstRowCheck);
                        }

                        Writer writer = Files.newBufferedWriter(file, StandardOpenOption.TRUNCATE_EXISTING);
                        CSVWriter csvWriter = new CSVWriter(writer,
                                CSVWriter.DEFAULT_SEPARATOR,
                                CSVWriter.NO_QUOTE_CHARACTER,
                                CSVWriter.DEFAULT_ESCAPE_CHARACTER,
                                CSVWriter.DEFAULT_LINE_END);
                        try {
                            csvWriter.writeAll(lines);
                        } finally {
                            if (csvWriter != null) {
                                csvWriter.close();
                            }
                        }
                    } catch (IOException | CsvException e) {
                        throw new RuntimeException("Error reading/writting CSV file: " + filename, e);
                    }
                }
                return resource;
            } else {
                throw new RuntimeException("Could not read file " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename);
        }
    }

    
    public String checkFirstRow(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource((file.toUri()));

            if (resource.exists() || resource.isReadable()) {
                if (filename.endsWith(".csv")) {

                    try (CSVReader reader = new CSVReader(Files.newBufferedReader(file))) {
                        List<String[]> lines;
                        try {
                            lines = reader.readAll();
                            if (!lines.isEmpty() && lines.get(0).length > 0) {

                            	StringBuilder responseBuilder = new StringBuilder("The first row contains the following sensitive terms:");
                            	for (String entry : lines.get(0)) {   
                                    
                                    boolean isBankAccount = Pattern.matches("^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$", entry);
                                    FinderEngine engine = new FinderEngine();
                                    List<String> matchedValues = engine.find (entry);
                                    boolean containsSensitiveData = containsSensitiveInformation(entry);
                                    if (containsSensitiveData) {
                                        responseBuilder.append(entry+"\n");
                                    } 
                                    if(matchedValues.size()>0) {
                                    	responseBuilder.append(matchedValues.toString());
                                    }
                                    if (isBankAccount) {
                                        responseBuilder.append(entry+"is in bank account format\n");
                                    }
                                }
                                return responseBuilder.toString();
                            }
                        } catch (CsvException e) {
                            throw new RuntimeException("Error reading CSV file: " + filename, e);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException("Error writting CSV file: " + filename, e);
                    }
                }
                throw new RuntimeException("Could not read file " + filename);
            }
            throw new RuntimeException("Could not read file: " + filename);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename);
        }
    }
    
    private boolean containsSensitiveInformation(String entry) {
        
    	String[] sensitiveTerms = {
    		    // Español
    		    "origen","raza","politica","ideologia","religion","afiliacion","sindicato","nombre","apellido",
    		    "geneticos","biometricos","sexual","orientacion","genero","correo",
    		    "correo electronico","datos bancarios","numero de cuenta","tarjeta de credito","IBAN","GPS",
    		    "biometrica","salud mental","preferencias personales","historial","discapacidad","direccion","coodernada",
    		    // Inglés
    		    "origin","race","politics","ideology","religion","affiliation","union","name","surname",
    		    "genetics","biometrics","sex","orientation","gender","genre","mail","bank details","account number","credit card",
    		    "biometrics","mental health","personal preferences","history","disability","location","coordinate"
    		};

        for (String term : sensitiveTerms) {
        	String normalizedEntry = removeAccents(entry.toLowerCase());
            if (normalizedEntry.toLowerCase().contains(term.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    private String removeAccents(String text) {
        return Normalizer.normalize(text, Normalizer.Form.NFD)
            .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }
}
