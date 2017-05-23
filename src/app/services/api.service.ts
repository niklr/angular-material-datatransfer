import { Injectable } from '@angular/core';
import { IDatatransferItem, DatatransferItem } from '../models';
import { TransferType, TransferStatus } from '../enums';

@Injectable()
export class ApiService {
  title = 'angular-material-datatransfer';

  testItems: IDatatransferItem[] = [
    new DatatransferItem({
      'id': '1',
      'name': 'DICOM_patientXY_1.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 15,
      'sizeUnit': 'MB',
      'transferType': TransferType.Upload,
      'status': TransferStatus.Uploading,
      'progress': 50,
      'speed': '489.7 KB/s',
      'elapsedTime': '00:00:49',
      'remainingTime': '00:02:00'
    }),
    new DatatransferItem({
      'id': '2',
      'name': 'DICOM_patientXY_2.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 17,
      'sizeUnit': 'MB',
      'transferType': TransferType.Upload,
      'status': TransferStatus.Failed,
      'progress': 0
    }),
    new DatatransferItem({
      'id': '3',
      'name': 'DICOM_patientXY_3.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 13,
      'sizeUnit': 'MB',
      'transferType': TransferType.Upload,
      'status': TransferStatus.Queued,
      'progress': 0
    }),
    new DatatransferItem({
      'id': '4',
      'name': 'DICOM_patientXY_4.dcm',
      'path': '/mnt/sdcard/folder1/a/b/',
      'size': 11,
      'sizeUnit': 'MB',
      'transferType': TransferType.Upload,
      'status': TransferStatus.Queued,
      'progress': 0
    }),
    new DatatransferItem({
      'id': '5',
      'name': 'SMIR.Thorax.089Y.M.CT.7.000.dcm.zip',
      'path': '/',
      'size': 2,
      'sizeUnit': 'GB',
      'transferType': TransferType.Download,
      'status': TransferStatus.Queued,
      'progress': 0
    }),
    new DatatransferItem({
      'id': '6',
      'name': 'NIFTI_patientXY.nii',
      'path': '/mnt/sdcard/folder2/d/',
      'size': 12,
      'sizeUnit': 'GB',
      'transferType': TransferType.Upload,
      'status': TransferStatus.Queued,
      'progress': 0
    })
  ];
}
