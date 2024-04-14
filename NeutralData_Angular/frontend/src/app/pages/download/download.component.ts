import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { MediaService } from 'src/app/services/media.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit,OnDestroy{
  mediaService = inject(MediaService);
  userService = inject(UserService);
  detectionInfo: any;
  fileId: string = '';

ngOnInit(): void {
  this.mediaService.getFileId().subscribe(
    (fileId: string) => {
      this.fileId = fileId;
      console.log('File ID:', this.fileId);

      this.mediaService.getDetectionInfo(this.fileId).subscribe(
        (detectionInfo) => {
          console.log('First Row Info:', detectionInfo);
          this.detectionInfo = detectionInfo;
        },
        (error) => {
          console.error('Error fetching first row info:', error);
        }
      );
    },
    (error) => {
      console.error('Error obtaining File ID:', error);
    }
  );
}

  ngOnDestroy(): void {
    // this.mediaService.setOriginalFileName(null);
    // this.mediaService.setFileId(null);
    if (this.fileId) {
      this.mediaService.deleteFile(this.fileId).subscribe(
        () => {
          console.log('File deleted from server');
        },
        (error) => {
          console.error('Error deleting file from server:', error);
        }
      );
    }
  }

  downloadFile() {
    this.mediaService.getFileUrl().pipe(
      take(1),
      switchMap((url) => {
        if (url) {
          return this.mediaService.getFile(url).pipe(
            take(1),
            switchMap((data: Blob) => {
              return this.mediaService.getOriginalFileName().pipe(
                take(1),
                switchMap((fileName) => {
                  if (fileName) {
                    const adjustedFileName = this.adjustFileName(fileName);
                    const file = new Blob([data], { type: 'application/octet-stream' });
                    const fileURL = URL.createObjectURL(file);
                    const link = document.createElement('a');
                    link.href = fileURL;
                    link.download = 'ND_' + adjustedFileName;
  
                    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                  }
                  return [];
                })
              );
            })
          );
        }
        return [];
      })
    ).subscribe();
  }
  
  private adjustFileName(fileName: string): string {
    if (fileName.toLowerCase().endsWith('.xlsx')) {
      return fileName.replace('.xlsx', '.csv');
    }
    return fileName;
  }
}
