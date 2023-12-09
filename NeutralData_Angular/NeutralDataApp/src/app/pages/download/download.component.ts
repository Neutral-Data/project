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
  firstRowInfo: any;
  fileId: string = '';

ngOnInit(): void {
  this.mediaService.getFileId().subscribe(
    (fileId: string) => {
      this.fileId = fileId; // Asigna el fileId obtenido
      console.log('File ID:', this.fileId);

      // Llama a getFirstRowInfo() dentro de esta suscripción
      this.mediaService.getFirstRowInfo(this.fileId).subscribe(
        (firstRowInfo) => {
          console.log('First Row Info:', firstRowInfo);
          this.firstRowInfo = firstRowInfo; // Asigna la respuesta a una variable en el componente
        },
        (error) => {
          console.error('Error fetching first row info:', error);
        }
      );
    },
    (error) => {
      console.error('Error al obtener el File ID:', error);
    }
  );
}

  ngOnDestroy(): void {
    this.mediaService.setOriginalFileName(null);
    this.mediaService.setFileId(null);
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
                    const file = new Blob([data], { type: 'application/octet-stream' });
                    const fileURL = URL.createObjectURL(file);
                    const link = document.createElement('a');
                    link.href = fileURL;
                    link.download = 'ND_' + fileName;

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
}
