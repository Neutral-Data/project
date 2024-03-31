import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGithubComponent } from './upload-github.component';

describe('UploadGithubComponent', () => {
  let component: UploadGithubComponent;
  let fixture: ComponentFixture<UploadGithubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadGithubComponent]
    });
    fixture = TestBed.createComponent(UploadGithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
