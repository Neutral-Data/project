import { Component, ViewChild, inject } from '@angular/core';
import { NgxCSVParserError, NgxCsvParser } from 'ngx-csv-parser';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  mediaService = inject(MediaService);
  csvfile: any;
  csvRecords: any[] = [];
  anyFile: boolean = false;
  header: boolean = true;
  showContent: boolean = false;
  fileUploadError: boolean = false;
  fileUploadSuccess: boolean = false;
  columnHeaders: string[] = [];

  constructor(private ngxCsvParser: NgxCsvParser) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;
    if (files && files.length > 0) {
      this.anyFile = true;
      this.showContent = true;
      this.csvfile = files[0];
    }
    this.ngxCsvParser
      .parse(files[0], {
        header: this.header,
        delimiter: ',',
        encoding: 'utf8'
      })
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          this.csvRecords = result.slice(0, 10);
          this.columnHeaders = this.header ? Object.keys(result[0]) : Object.keys(result[0]);
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
          this.csvRecords = [];
        }
      );
  }
  
  upload(){
   
      const formData = new FormData();
      formData.append("file", this.csvfile);

      this.mediaService.uploadFile(formData).subscribe((response) => {
        console.log('response',response);
        this.fileUploadError = false;
        this.fileUploadSuccess = true;
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.fileUploadError = true;
        this.fileUploadSuccess = false;

      });
    }


  
}
