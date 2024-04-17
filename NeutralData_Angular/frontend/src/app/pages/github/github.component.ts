import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from 'src/app/services/github.service';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css'],
})
export class GithubComponent {
  username: string = '';
  token: string = '';
  repos: any[] = [];
  csvFileUrl: string = '';

  constructor(private githubService: GithubService, private router: Router) {}

  loadRepos() {
    if (this.username || this.token) {
      this.githubService.getRepos(this.username, this.token).subscribe(
        (repos) => {
          this.repos = repos;
          this.repos.forEach((repo) => {
            this.githubService.getCSVFiles(this.username, repo.name).subscribe(
              (csvFiles) => {
                repo.csvFiles = csvFiles as any[];
              },
              (error) => {
                console.error('Error loading CSV files:', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error loading repos:', error);
        }
      );
    } else {
      console.error('Username is required');
    }
  }

  selectCSVFile(csvFileUrl: string) {
    this.githubService.setCsvFileUrl(csvFileUrl);
    this.router.navigate(['/upload-github'], {
      state: { csvFileUrl: csvFileUrl },
    });
  }
}
