import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCSVParserError, NgxCsvParser } from 'ngx-csv-parser';
import { GithubService } from 'src/app/services/github.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-upload-github',
  templateUrl: './upload-github.component.html',
  styleUrls: ['./upload-github.component.css']
})
export class UploadGithubComponent implements OnInit {

  csvFileUrl: string = '';
  uploading: boolean = false;
  fileUploadSuccess: boolean = false;
  fileUploadError: boolean = false;
  uploadProgress: number = 0;
  fileName: string = 'dasdsa';
  csvRecords: any[] = [];
  columnHeaders: string[] = [];
  showContent: boolean = false;
  header: boolean = true;
  detectColumns: boolean = true;
  detectRows: boolean = true;
  detectProfanity: boolean = false;

  constructor(
    private http: HttpClient,
    private mediaService: MediaService,
    private githubService: GithubService,
    private router: Router
  ) {}

  ngOnInit() {
      this.csvFileUrl = this.githubService.getCsvFileUrl();
      this.loadCsvFromGithub();
  }

  loadCsvFromGithub() {
    const url = this.csvFileUrl;

    this.http.get(url, { responseType: 'text' }).subscribe(
      (data: string) => {
        this.fileName = this.extractFilenameFromUrl(url)
        const records = this.parseCsvData(data);
        this.csvRecords = records.slice(0, 1000);
        this.columnHeaders = Object.keys(records[0]);
        this.showContent = true;
      },
      (error) => {
        console.error('Error downloading file from GitHub:', error);
      }
    );
  }

  private parseCsvData(data: string): any[] {
    const csvData = data.split('\n');
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

  upload() {
    this.uploading = true;
    const url = this.csvFileUrl;

    this.http.get(url, { responseType: 'text' }).subscribe(
      (data: string) => {
        const formData = new FormData();
        formData.append('file', new Blob([data], { type: 'text/csv' }), this.extractFilenameFromUrl(url));

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

  private extractFilenameFromUrl(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1];
  }
}