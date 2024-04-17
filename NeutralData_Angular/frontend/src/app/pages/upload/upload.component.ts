import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCSVParserError, NgxCsvParser } from 'ngx-csv-parser';
import { MediaService } from 'src/app/services/media.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  mediaService = inject(MediaService);
  router = inject(Router);

  csvfile: any;
  csvRecords: any[] = [];
  anyFile: boolean = false;
  header: boolean = true;
  showContent: boolean = false;
  fileUploadError: boolean = false;
  fileUploadSuccess: boolean = false;
  columnHeaders: string[] = [];

  detectColumns: boolean = true;
  detectRows: boolean = true;
  detectProfanity: boolean = true;
  ownTerms: boolean = false;

  customTerms: string = '';

  constructor(private ngxCsvParser: NgxCsvParser) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    if (files && files.length > 0) {
      const file: File = files[0];

      if (file.name.endsWith('.xlsx')) {
        this.convertExcelToCSV(file);
      } else {
        this.anyFile = true;
        this.showContent = true;
        this.csvfile = file;

        this.parseCSV(file);
      }
    }
  }

  convertExcelToCSV(file: File): void {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const fileContent = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(fileContent, { type: 'binary' });

      const firstSheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

      const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const csvData: string = excelData.map((row: any) => row.join(',')).join('\n');

      this.anyFile = true;
      this.showContent = true;
      this.csvfile = new File([csvData], file.name.replace('.xlsx', '.csv'), { type: 'text/csv' });

      this.parseCSV(this.csvfile);
    };

    reader.readAsBinaryString(file);
  }

  parseCSV(file: File): void {
    this.ngxCsvParser
      .parse(file, {
        header: this.header,
        delimiter: ',',
        encoding: 'utf8'
      })
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          this.csvRecords = result.slice(0, 100);
          this.columnHeaders = this.header ? Object.keys(result[0]) : Object.keys(result[0]);
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
          this.csvRecords = [];
        }
      );
  }

  upload() {
    const formData = new FormData();
    formData.append("file", this.csvfile);
    if (this.customTerms.trim() !== '') {
      formData.append("customTerms", this.customTerms.trim());
      this.ownTerms = true;
    }
    this.mediaService.setDetectOptions({
      detectColumns: this.detectColumns,
      detectRows: this.detectRows,
      detectProfanity: this.detectProfanity,
      ownTerms: this.ownTerms
    });
    
    this.mediaService.uploadFile(formData).subscribe(
      (response) => {
        this.mediaService.setFileUrl(response['url']);
        if (response['terms'] !== 'None') {
          this.mediaService.setOwnTermName(response['terms']);
        }
        this.mediaService.setOriginalFileName(this.csvfile['name']);
        this.mediaService.setFileId(response['url'].split('/media/')[1]);
        this.fileUploadError = false;
        this.fileUploadSuccess = true;
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.fileUploadError = true;
        this.fileUploadSuccess = false;
      }
    );
  }
}
