import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  title = 'angular-dtm';

  testItems = [
    {
      'name': 'DICOM_patientXY_1.dcm',
      'size': '15 MB',
      'transferType': 'Upload',
      'status': 'Uploading',
      'progress': 50,
      'speed': '489.7 KB/s',
      'elapsedTime': '00:00:49',
      'remainingTime': '00:02:00'
    },
    {
      'name': 'DICOM_patientXY_2.dcm',
      'size': '17 MB',
      'transferType': 'Upload',
      'status': 'Failed',
      'progress': 0,
      'speed': '',
      'elapsedTime': '',
      'remainingTime': ''
    },
    {
      'name': 'SMIR.Thorax.089Y.M.CT.7.000.dcm.zip',
      'size': '2 GB',
      'transferType': 'Download',
      'status': 'Queued',
      'progress': 0,
      'speed': '',
      'elapsedTime': '',
      'remainingTime': ''
    },
    {
      'name': 'NIFTI_patientXY.nii',
      'size': '12 GB',
      'transferType': 'Upload',
      'status': 'Queued',
      'progress': 0,
      'speed': '',
      'elapsedTime': '',
      'remainingTime': ''
    }
  ];
}
