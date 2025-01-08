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

getLotDeletionDetails(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.ApiUrl}GetLotDeletionDetails`);
}


}
