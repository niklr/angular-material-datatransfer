import { Injectable } from '@angular/core';
import { IDatatransferItem, DatatransferItem, SizeInformation } from '../models';
import { TransferType, TransferStatus, DecimalByteUnit } from '../enums';

@Injectable()
export class ApiService {
  title = 'angular-material-datatransfer';

  testItems: IDatatransferItem[] = [
    new DatatransferItem({
      id: '1',
      name: 'DICOM_patientXY_1.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      sizeInformation: new SizeInformation({decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 15}),
      transferType: TransferType.Upload,
      status: TransferStatus.Uploading,
      progress: 0.5,
      speed: '489.7 KB/s',
      elapsedTime: '00:00:49',
      remainingTime: '00:02:00'
    }),
    new DatatransferItem({
      id: '2',
      name: 'DICOM_patientXY_2.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      sizeInformation: new SizeInformation({decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 17}),
      transferType: TransferType.Upload,
      status: TransferStatus.Failed,
      progress: 0
    }),
    new DatatransferItem({
      id: '3',
      name: 'DICOM_patientXY_3.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      sizeInformation: new SizeInformation({decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 13}),
      transferType: TransferType.Upload,
      status: TransferStatus.Queued,
      progress: 0
    }),
    new DatatransferItem({
      id: '4',
      name: 'DICOM_patientXY_4.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      sizeInformation: new SizeInformation({decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 11}),
      transferType: TransferType.Upload,
      status: TransferStatus.Queued,
      progress: 0
    }),
    new DatatransferItem({
      id: '5',
      name: 'SMIR.Thorax.089Y.M.CT.7.000.dcm.zip',
      path: '/',
      sizeInformation: new SizeInformation({decimalByteUnit: DecimalByteUnit.GB, decimalByteUnitSize: 2}),
      transferType: TransferType.Download,
      status: TransferStatus.Queued,
      progress: 0
    }),
    new DatatransferItem({
      id: '6',
      name: 'NIFTI_patientXY.nii',
      path: '/mnt/sdcard/folder2/d/',
      sizeInformation: new SizeInformation({decimalByteUnit: DecimalByteUnit.GB, decimalByteUnitSize: 12}),
      transferType: TransferType.Upload,
      status: TransferStatus.Queued,
      progress: 0
    })
  ];
}
