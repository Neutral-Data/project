import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  constructor(private http: HttpClient) {}
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
        Authorization: `token ${token}`,
      };
      return this.http.get<any[]>(
        `https://api.github.com/users/${username}/repos`,
        { headers }
      );
    } else {
      return this.http.get<any[]>(
        `https://api.github.com/users/${username}/repos`,
        { headers }
      );
    }
  }

  getCSVFiles(username: string, repository: string): Observable<string[]> {
    const url = `https://api.github.com/repos/${username}/${repository}/contents`;

    return this.http.get<any[]>(url).pipe(
      switchMap((files) => {
        const observables: Observable<string | string[]>[] = [];
        files.forEach((file) => {
          if (
            file.type === 'file' &&
            (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))
          ) {
            observables.push(of(file.download_url));
          } else if (file.type === 'dir') {
            observables.push(this.getFilesInDirectory(file.url));
          }
        });
        return forkJoin(observables);
      }),
      map((urls) => {
        return urls.map((url) => (Array.isArray(url) ? url[0] : url));
      }),
      catchError((error) => {
        console.error('Error fetching CSV files:', error);
        return of([]);
      })
    );
  }
  private getFilesInDirectory(url: string): Observable<string[]> {
    return this.http.get<any[]>(url).pipe(
      map((files) =>
        files
          .filter(
            (file) =>
              file.type === 'file' &&
              (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))
          )
          .map((file) => file.download_url)
      ),
      catchError((error) => {
        console.error('Error fetching files in directory:', error);
        return of([]);
      })
    );
  }
}
