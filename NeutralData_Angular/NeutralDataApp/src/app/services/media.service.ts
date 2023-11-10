import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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
  
}
