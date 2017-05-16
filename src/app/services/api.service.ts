import { Injectable } from '@angular/core';

interface TestItem {
  name: string;
  path: string;
  size: number;
  transferType: string;
  status: string;
  progress: number;
  speed?: string;
  elapsedTime?: string;
  remainingTime?: string;
}

@Injectable()
export class ApiService {
  title = 'angular-dtm';

  testItems: TestItem[] = [
    {
      'name': 'DICOM_patientXY_1.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 15,
      'transferType': 'Upload',
      'status': 'Uploading',
      'progress': 50,
      'speed': '489.7 KB/s',
      'elapsedTime': '00:00:49',
      'remainingTime': '00:02:00'
    },
    {
      'name': 'DICOM_patientXY_2.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 17,
      'transferType': 'Upload',
      'status': 'Failed',
      'progress': 0
    },
    {
      'name': 'SMIR.Thorax.089Y.M.CT.7.000.dcm.zip',
      'path': '/',
      'size': 2,
      'transferType': 'Download',
      'status': 'Queued',
      'progress': 0
    },
    {
      'name': 'NIFTI_patientXY.nii',
      'path': '/mnt/sdcard/folder2/d/',
      'size': 12,
      'transferType': 'Upload',
      'status': 'Queued',
      'progress': 0
    }
  ];
}
