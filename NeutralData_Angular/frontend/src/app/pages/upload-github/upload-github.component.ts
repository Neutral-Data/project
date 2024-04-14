import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { GithubService } from 'src/app/services/github.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-upload-github',
  templateUrl: './upload-github.component.html',
  styleUrls: ['./upload-github.component.css']
})
export class UploadGithubComponent implements OnInit {

  fileUrl: string = '';
  uploading: boolean = false;
  fileUploadSuccess: boolean = false;
  fileUploadError: boolean = false;
  uploadProgress: number = 0;
  fileName: string = 'placeholder';
  csvRecords: any[] = [];
  columnHeaders: string[] = [];
  showContent: boolean = false;
  header: boolean = true;
  detectColumns: boolean = true;
  detectRows: boolean = true;
  detectProfanity: boolean = false;

  constructor(
    private http: HttpClient,
    private githubService: GithubService,
    private mediaService: MediaService,
    private router: Router
  ) {}

  ngOnInit() {
      this.fileUrl = this.githubService.getCsvFileUrl();
      this.loadFileFromGithub();
  }

  loadFileFromGithub() {
    const url = this.fileUrl;
    console.log('Esta URL:', url);
    this.http.get(url, { responseType: 'arraybuffer' }).subscribe(
      (data: ArrayBuffer) => {
        this.fileName = this.extractFilenameFromUrl(url)
        const records = this.parseFileData(data, url);
        this.csvRecords = records.slice(0, 1000);
        this.columnHeaders = Object.keys(records[0]);
        this.showContent = true;
      },
      (error) => {
        console.error('Error downloading file from GitHub:', error);
      }
    );
  }

  private parseFileData(data: ArrayBuffer, url: string): any[] {
    console.log('Parsing file data:', data);
    console.log('File URL:', url);
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'xlsx') {
      return this.parseXlsxData(data);
    } else {
      return this.parseCsvData(data);
    }
  }

  private parseCsvData(data: ArrayBuffer): any[] {
    const text = new TextDecoder().decode(data);
    const csvData = text.split('\n');
    const headers = csvData[0].split(',');
    const records = [];
    for (let i = 1; i < csvData.length; i++) {
      const record = {};
      const fields = csvData[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = fields[j];
      }
      records.push(record);
    }
    return records;
  }

  private parseXlsxData(data: ArrayBuffer): any[] {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
  }

  upload() {
    this.uploading = true;
    const url = this.fileUrl;
  
    this.http.get(url, { responseType: 'arraybuffer' }).subscribe(
      (data: ArrayBuffer) => {
        const file: Blob = this.convertToCsv(data, url);
  
        const formData = new FormData();
        formData.append('file', file, this.adjustFilename(this.extractFilenameFromUrl(url)));
  
        this.mediaService.setDetectOptions({
          detectColumns: this.detectColumns,
          detectRows: this.detectRows,
          detectProfanity: this.detectProfanity
        });
  
        this.mediaService.uploadFile(formData).subscribe(
          (response) => {
            this.uploading = false;
            this.fileUploadSuccess = true;
            console.log('File uploaded successfully:', response);
  
            this.mediaService.setFileUrl(response['url']);
            this.mediaService.setOriginalFileName(this.extractFilenameFromUrl(url));
            this.mediaService.setFileId(response['url'].split('/media/')[1]);
            
            this.router.navigate(['/download']);
          },
          (error) => {
            this.uploading = false;
            this.fileUploadError = true;
            console.error('Error uploading file:', error);
          }
        );
      },
      (error) => {
        console.error('Error downloading file from GitHub:', error);
        this.uploading = false;
      }
    );
  }
  
  private adjustFilename(filename: string): string {
    if (filename.toLowerCase().endsWith('.xlsx')) {
      return filename.replace('.xlsx', '.csv');
    }
    return filename;
  }
  
  private convertToCsv(data: ArrayBuffer, url: string): Blob {
    const extension = url.split('.').pop()?.toLowerCase();
    let filename = this.extractFilenameFromUrl(url);
    if (extension === 'xlsx') {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(sheet);
      filename = filename.replace('.xlsx', '.csv');
      return new Blob([csvData], { type: 'text/csv' });
    } else {
      const text = new TextDecoder().decode(data);
      return new Blob([text], { type: 'text/csv' });
    }
  }
  
  private extractFilenameFromUrl(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1];
  }
}
