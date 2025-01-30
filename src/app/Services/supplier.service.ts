import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private httpClient: HttpClient) { }

  ApiUrl: any = environment.ApiSupplierService;

  getParentTableData(PONumber: number): Observable<any> {
    return this.httpClient.get<any[]>(this.ApiUrl + `GetPODetails?PONumber=${PONumber}`);
  }

  getPONumber(SupplierCode: string | null) {
    if (SupplierCode === null) {
      return this.httpClient.get<any>(`${this.ApiUrl}GetPONumber`);
    }
    else {
      return this.httpClient.get<any>(`${this.ApiUrl}GetPONumber?suppliercode=` + SupplierCode);
    }

  }


  getPOHeaders(SupplierCode: string | null) {
    if (SupplierCode === null) {
      return this.httpClient.get<any>(`${this.ApiUrl}GetPOHeaders`);
    }
    else {
      return this.httpClient.get<any>(`${this.ApiUrl}GetPOHeaders?suppliercode=` + SupplierCode);
    }
  }

  
  updateLot(lot: any): Observable<any> {
    return this.httpClient.post<any>(this.ApiUrl + "UpsertLotDetails", lot);
  }


  DeleteLotDetails(PONumber : number, ItemNo: number, LotNumber: number, Qty: number, Reason: string, userID: number): Observable<any> {
    return this.httpClient.delete(`${this.ApiUrl}DeleteLotDetail/${PONumber}/${ItemNo}/${LotNumber}/${Reason}/${Qty}/${userID}`);
    
  } 

  
  getsuppliers(){
    return this.httpClient.get<any>(`${this.ApiUrl}GetSupplier`);
  }


  
getdocdetails(pono:string,itemno:string,lotno:number): Observable<any[]> {
  debugger;
  return this.httpClient.get<any[]>(`${this.ApiUrl}Getdocuploaddeatils/${pono}/${itemno}/${lotno}`);
}

uploadFile(file: File, docno:string, doctype:string, poNumber:string, itemNumber:string, lotNumber:string,remarks:string,updatedBy:string): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('docno',docno);
  formData.append('doctype',doctype);
  formData.append('poNumber', poNumber);
  formData.append('itemNumber', itemNumber);
  formData.append('lotNumber',lotNumber);
  formData.append('remarks',remarks);
  formData.append('updatedby',updatedBy);
  debugger;
  
  return this.httpClient.post(this.ApiUrl+"UploadDoc", formData);
}

downloadMultipleFiles(fileRequests: any[]): Observable<Blob> {
  debugger;
  return this.httpClient.post(this.ApiUrl+"DownloadMultipleFiles", fileRequests, { responseType: 'blob' }); // Expect a blob response
}

  



}
