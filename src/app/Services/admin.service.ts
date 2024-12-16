import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }

  ApiUrl: any = environment.ApiAdminService;

  validateUserLogin(user: any): Observable<any> {
    return this.httpClient.post<any>(this.ApiUrl + 'ValidateUserLogin', user);
  }

  getMenu(id: any): Observable<any> {
    return this.httpClient.get<any[]>(this.ApiUrl + `GetMenu?id=${id}`);
  }

  getuserdetails() {
    return this.httpClient.get<any[]>(this.ApiUrl + 'Getusermaster');
  }

  getroles() {
    return this.httpClient.get<any[]>(this.ApiUrl + 'Getroles');
  }
  getSupplier(){
    return this.httpClient.get<any[]>(this.ApiUrl+ 'GetSuppliers');
  }

  adduserdetails(user: any): Observable<any> {
    debugger;
    return this.httpClient.post<any>(this.ApiUrl + "Adduser", user);
  }

  updateuserdetails(data: any): Observable<any> {
    return this.httpClient.post<any>(this.ApiUrl + 'UpdateUserData', data);
  }

  Inactiveuser(userId: any) {
    return this.httpClient.post<any>(this.ApiUrl + 'DeleteUserData', userId);
  }

  getsupplierdetails():Observable<any[]>{
    return this.httpClient.get<any[]>(
        this.ApiUrl+'GetSupplierDetails'
    );
  }
  getcountrydetails():Observable<any[]>{
    return this.httpClient.get<any[]>(
      this.ApiUrl+'GetCountryDetails'
 
    );
  }
  Inactivesupplier(userId: any) {
    return this.httpClient.post<any>(this.ApiUrl + 'DeleteSupplierData', userId);
  }
 
  addsupplierdetails(supplier: any): Observable<any> {
    debugger;
    return this.httpClient.post<any>(this.ApiUrl + "Addsupplier", supplier);
  }
 
  updatesupplierdetails(data: any): Observable<any> {
    return this.httpClient.post<any>(this.ApiUrl + 'UpdateSupplierData', data);
  }

  getRoleDetails(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.ApiUrl + 'GetRolesDetails');
  }
 
 updateRoleDetails(user: any): Observable<any> {
    debugger;
    return this.httpClient.post<any>(this.ApiUrl + 'UpdateRoleData', user);
  }
 
  addRoleDetails(user: any):Observable<any>{
    return this.httpClient.post<any>( this.ApiUrl+'AddRoleData',user);
  }
  
}
