import { Injectable } from '@angular/core';

export interface TestItem {
  name: string;
  path: string;
  size: number;
  sizeUnit: string;
  transferType: string;
  status: string;
  progress: number;
  speed?: string;
  elapsedTime?: string;
  remainingTime?: string;
  isSelected?: boolean;
}

@Injectable()
export class ApiService {
  title = 'angular-dtm';

  testItems: TestItem[] = [
    {
      'name': 'DICOM_patientXY_1.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 15,
      'sizeUnit': 'MB',
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
      'sizeUnit': 'MB',
      'transferType': 'Upload',
      'status': 'Failed',
      'progress': 0
    },
    {
      'name': 'DICOM_patientXY_3.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 13,
      'sizeUnit': 'MB',
      'transferType': 'Upload',
      'status': 'Queued',
      'progress': 0
    },
    {
      'name': 'DICOM_patientXY_4.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 11,
      'sizeUnit': 'MB',
      'transferType': 'Upload',
      'status': 'Queued',
      'progress': 0
    },
    {
      'name': 'SMIR.Thorax.089Y.M.CT.7.000.dcm.zip',
      'path': '/',
      'size': 2,
      'sizeUnit': 'GB',
      'transferType': 'Download',
      'status': 'Queued',
      'progress': 0
    },
    {
      'name': 'NIFTI_patientXY.nii',
      'path': '/mnt/sdcard/folder2/d/',
      'size': 12,
      'sizeUnit': 'GB',
      'transferType': 'Upload',
      'status': 'Queued',
      'progress': 0
    }
  ];
}
