import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private http: HttpClient) { }
  private csvFileUrl: string = '';
  
  setCsvFileUrl(url: string): void {
    this.csvFileUrl = url;
  }

  getCsvFileUrl(): string {
    return this.csvFileUrl;
  }

  getRepos(username: string, token?: string) {
    let headers = {};
    if (token) {
      headers = {
        Authorization: `token ${token}`
      };
      return this.http.get<any[]>(`https://api.github.com/user/repos`, { headers });
    }else{
      return this.http.get<any[]>(`https://api.github.com/users/${username}/repos`, { headers });
    }
  }
   
  getCSVFiles(username: string, repository: string): Observable<string[]> {
    const url = `https://api.github.com/repos/${username}/${repository}/contents`;
    return this.http.get<any[]>(url).pipe(
      map(files => files.filter(file => file.name.endsWith('.csv')).map(file => file.download_url))
    );
  }
}
