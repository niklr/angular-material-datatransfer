import { Injectable } from '@angular/core';
import { IDatatransferItem, DatatransferItem } from '../models/datatransfer-item.model';
import { SizeContainer } from '../models/size-container.model';
import { DecimalByteUnit } from '../enums/decimal-byte-unit.enum';
import { ProgressContainer } from '../models/progress-container.model';
import { TransferType } from '../enums/transfer-type.enum';
import { TransferStatus } from '../enums/transfer-status.enum';
import { PreprocessContainer } from '../models/preprocess-container.model';

@Injectable()
export class DemoService {
  title = 'angular-material-datatransfer';

  testItems: IDatatransferItem[] = [
    new DatatransferItem({
      id: '1',
      name: 'DICOM_patientXY_1.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 15 }),
      progressContainer: new ProgressContainer(15 * 1000 * 1000),
      transferType: TransferType.Upload,
      status: TransferStatus.Uploading
    }),
    new DatatransferItem({
      id: '2',
      name: 'DICOM_patientXY_2.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 17 }),
      transferType: TransferType.Upload,
      status: TransferStatus.Failed
    }),
    new DatatransferItem({
      id: '3',
      name: 'DICOM_patientXY_3.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      preprocessContainer: new PreprocessContainer({ percent: 30 }),
      sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 13 }),
      transferType: TransferType.Upload,
      status: TransferStatus.Preprocessing
    }),
    new DatatransferItem({
      id: '4',
      name: 'DICOM_patientXY_4.dcm',
      path: '/mnt/sdcard/folder1/a/b/',
      sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.MB, decimalByteUnitSize: 11 }),
      transferType: TransferType.Upload,
      status: TransferStatus.Queued,
    }),
    new DatatransferItem({
      id: '5',
      name: 'SMIR.Thorax.089Y.M.CT.7.000.dcm.zip',
      path: '/',
      sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.GB, decimalByteUnitSize: 2 }),
      transferType: TransferType.Download,
      status: TransferStatus.Queued
    }),
    new DatatransferItem({
      id: '6',
      name: 'NIFTI_patientXY.nii',
      path: '/mnt/sdcard/folder2/d/',
      sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.GB, decimalByteUnitSize: 12 }),
      transferType: TransferType.Upload,
      status: TransferStatus.Queued,
    })
  ];
}
