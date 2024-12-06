import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  
  constructor(private httpClient: HttpClient) { }

  ApiUrl: any = environment.ApiReportService;

  
getpodetails(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.ApiUrl}Getpodetailsreport`);
}

getdocdetails(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.ApiUrl}Getdocuploaddeatils`);
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
  
  return this.httpClient.post(this.ApiUrl, formData);
}

downloadMultipleFiles(fileRequests: any[]): Observable<Blob> {
  debugger;
  return this.httpClient.post(this.ApiUrl, fileRequests, { responseType: 'blob' }); // Expect a blob response
}

uploadFileDetails(data:any):Observable<any>
{
  return this.httpClient.post<any>(this.ApiUrl,data)
}

}
