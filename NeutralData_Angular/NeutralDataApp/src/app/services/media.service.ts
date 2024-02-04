import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  http = inject(HttpClient);

  token = window.localStorage.getItem("auth_token");

  uploadFile(formData: FormData){
    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });
  
    const options = {
      headers: headers
    };
    return this.http.post('http://localhost:8080/media/upload', formData, options);
  }
  
  obtenerUrlVistaPrevia(urlResponse: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });
  
    const options = {
      headers: headers
    };

    return this.http.get(urlResponse, options);
  }

  getFile(filename: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    return this.http.get(filename, { headers, responseType: 'blob' });
  }

  private fileUrlSubject = new BehaviorSubject<string>('');
  private filIdSubject = new BehaviorSubject<string>('');
  setFileUrl(url: string) {
    this.fileUrlSubject.next(url);
  }

  getFileUrl() {
    return this.fileUrlSubject.asObservable();
  }

  private fileNameSubject = new BehaviorSubject<string>('');

  setOriginalFileName(fileName: string) {
    this.fileNameSubject.next(fileName);
  }

  getOriginalFileName() {
    return this.fileNameSubject.asObservable();
  }

  setFileId(fileId: string) {
    this.filIdSubject.next(fileId);
  }

  getFileId() {
    return this.filIdSubject.asObservable();
  }

  private detectOptions: any = {
    detectColumns: true,
    detectRows: true,
    detectProfanity: false
  };

  setDetectOptions(options: any): void {
    this.detectOptions = options;
  }

  getDetectOptions(): any {
    return this.detectOptions;
  }

  getDetectionInfo(filename: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.token
  });

  const detectOptions = this.getDetectOptions();

  const options = {
    headers: headers,
    params: {
      'detectColumns': detectOptions.detectColumns.toString(),
      'detectRows': detectOptions.detectRows.toString(),
      'detectProfanity': detectOptions.detectProfanity.toString()
    },
    responseType: 'text' as 'json'
  };

  return this.http.get(`http://localhost:8080/media/${filename}/detection`, options);
}

deleteFile(fileId: string): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: 'Bearer ' + this.token
  });

  const options = {
    headers: headers,
    responseType: 'text' as 'json'
  };

  return this.http.delete(`http://localhost:8080/media/${fileId}`, options);
}

}
