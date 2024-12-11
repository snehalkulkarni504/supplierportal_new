import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from '../../../models/supplier';
import { SearchPipe } from '../../../SearchPipe/search.pipe';
import { AdminService } from '../../../Services/admin.service';



@Component({
  selector: 'app-supplier-master',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, NgxPaginationModule, NgbPaginationModule, NgSelectModule, SearchPipe],
  templateUrl: './supplier-master.component.html',
  styleUrl: './supplier-master.component.css'
})
export class SupplierMasterComponent {
// supplierdata: any;
// CountryId: any;
//   countryId: any;
  
  // pageSize: number;
  // AddSupplierMasterForm: FormGroup<any>;
  
    constructor(public service: AdminService, private toastr: ToastrService) {
      this.config = {
        currentPage: 1,
        itemsPerPage: 10
      };
    }
    countries:any;
    filterMetadata = { count: 0 };
   
    isSubmitted: boolean = false;
    
    supplierMasterForm!: FormGroup;
    AddsupplierMasterForm!: FormGroup;
    supplierList: any;
    display = "none";
    txt_btn: string = 'Save';
    supplierToEdit:any =null;
  
    textsearch: string = '';
    page: number = 1;
    pageSize: number = 10;
    config: any;
    currentPage = 1;
    itemsPerPage = 5;
    totalPages = 2;
    UserId:any;

    supplierdata: any;

    CountryId: any;
    countryId: any;
    supplierCode: any;
    supplierName: any;
    country: any;
    status: string = 'Active';
    isActive: boolean = false;
    createdBy: number = 1; // Default user ID
    createdOn: Date = new Date();
    Active = "Active";
    
  
    isEditing: boolean = false;
    editSupplierIndex: number | null = null;
  
    ngOnInit() {
     this.UserId  = localStorage.getItem("mst_user_id");

      this.supplierMasterForm = new FormGroup({
        textsearch: new FormControl(),
      });
      this.AddsupplierMasterForm = new FormGroup({
        supplierCode: new FormControl(),
        supplierName: new FormControl(),
        country: new FormControl(),
        status: new FormControl()
      });
      this.getSupplier();
      this.getcountrydetails();
      // this.getsupplierdetails();
  
      // this.getSupplierDetails();
    }
  
    // async getSupplier() {
    //   debugger;
    //   this.supplierdata =this.service.getsupplierdetails().toPromise();
      // this.filteredSuppliers = supplierdata;
  
    
    // }
    IsCheckedBox() {

      console.log(this.isActive)
      if (this.isActive) {
        this.Active = "Active";
      }
      else {
        this.Active = "Inactive";
      }
    }
    openDeleteConfirmation(supplierId: number): void {
      debugger;

      if (confirm("Are you sure you want to mark this role as Inactive?")) {
        if (supplierId !== null) {
          this.deleteuser(supplierId);
        }
        this.getSupplier();
  
      }

    }
    getSupplier() {
      this.service.getsupplierdetails().subscribe(
        (data : any[]) => {
          console.log(data);
          this.supplierdata = data;
          this.supplierList= data;
          
        },
        (err: any) => {
          console.error('Error fetching supplier details', err);
          this.toastr.error('Error fetching supplier details.');
        }
      );
    }
    getcountrydetails() {
      this.service.getcountrydetails().subscribe(
        (data : any[]) => {
          console.log(data);
          this.countries = data; 
        },
        (err: any) => {
          console.error('Error fetching supplier details', err);
          this.toastr.error('Error fetching supplier details.');
        }
      );
    }
  
    deleteuser(userId: any): void {
      debugger;
      this.service.Inactivesupplier(userId).subscribe(
        (response) => {
          console.log('User successfully deactivated:', response);
          this.getSupplier();
          this.toastr.success('User deleted successfully!');
        },
        (error) => {
          console.error('Error deactivating user:', error);
        }
      );
    }
    addsupplierdetailsinfo(data: any) {
      this.service.addsupplierdetails(data).subscribe({
        next: (response: any) => {
          console.log('Supplier added successfully', response);
          this.toastr.success('Supplier added successfully!');
          this.getSupplier();
        },
        error: (err: any) => {
          console.error('Error updating Supplier ', err);
        },
        complete: () => {
          console.log('Update Supplier request completed');
  
        }
      });
    }
    updatesupplierdetailsinfo(data: any) {
      debugger;
  
      this.service.updatesupplierdetails(data).subscribe({
        next: (response: any) => {
          console.log('Supplier role updated successfully', response);
          this.toastr.success('Supplier updated successfully!');
          this.getSupplier();
        },
        error: (err: any) => {
          console.error('Error updating Supplier', err);
        },
        complete: () => {
          console.log('Update Supplier request completed');
  
  
        }
        
      });
  
    }
    isDuplicate(supplierCode: string | number): boolean {
      // Normalize the input by converting to a trimmed lowercase string
      const normalizedCode = supplierCode.toString().trim().toLowerCase();
    
      // Check for duplicates in the supplierList array
      const duplicate = this.supplierList.some((supplier: any) => {
        const currentCode = supplier?.supplierCode?.toString()?.trim()?.toLowerCase();
        return currentCode === normalizedCode;
      });
    
      return duplicate;
    }
    
  
  
    toggleAddSupplierPopup(supplier?: any) {

      if (supplier && supplier.supplierId !== undefined) {
        this.isEditing = true;
        this.editSupplierIndex = supplier.supplierId;
        this.supplierToEdit = supplier;

        this.supplierCode = supplier.supplierCode;
        this.supplierName = supplier.supplierName;
        this.country = supplier.countryId; 

        this.isActive = supplier.status ;

        if(supplier.status == "Active"){
          this.isActive = true
        }
        else{
          this.isActive = false
        }
      } 
      
      else {
        
        this.isSubmitted=false;
        this.supplierCode = "";
        this.supplierName = "";
        this.country = "";

        this.status = 'Active';
        this.isActive = true;

        this.isEditing = false;
        this.editSupplierIndex = null;
      }
      this.display = "block";
    }
  
    saveSupplier() {
      debugger;
      this.isSubmitted = true;
  
      // if (!this.supplierCode || !this.supplierName || !this.country) {
      //   this.toastr.warning("Please fill all required fields.");
      //   return;
      // }
      if (!this.supplierCode) {
        this.toastr.warning("Please Enter SupplierCode.");
        return;
        
      }
      this.isSubmitted = true;
      if (!this.supplierName) {
        this.toastr.warning("Please enter SupplierName.");
        return;
      }

      if (!this.country) {
        this.toastr.warning("Please Select Country.");
        return;
      }
  
      if (this.isEditing && this.editSupplierIndex!=null) {
        const updatesupplierData = {
          supplierId: this.editSupplierIndex,

          supplierCode: this.supplierCode,
          supplierName: this.supplierName,
          CountryId: this.country,
          IsActive: this.isActive ,
          ModifiedBy:this.UserId,
          // createdOn: this.createdOn
        };
        
        this.updatesupplierdetailsinfo(updatesupplierData);
        console.log('Updated supplier', updatesupplierData);
        
      } else {
        const supplierData = {

          supplierCode: this.supplierCode,
          supplierName: this.supplierName,
          CountryId: this.country,
          IsActive: this.isActive ,
          createdBy: this.UserId,
          createdOn: this.createdOn
        };
        if (this.isDuplicate(this.supplierCode)) {
          this.toastr.warning('SupplierCode already exists.');
          return;
        } 

        this.addsupplierdetailsinfo(supplierData);
        console.log('Added supplier', supplierData);
       
      }
  
      this.onCloseHandled();
    }
    goBack(): void {
      window.history.back();
    }
  
    toggleStatus() {
      this.isActive = !this.isActive;
      this.status = this.isActive ? 'Active' : 'Inactive';
    }
  
    onCloseHandled() {
      this.display = "none";
    }
    onSearchEnter(event: Event): void {
      const keyboardEvent = event as KeyboardEvent; 
      keyboardEvent.preventDefault(); 
      console.log('Enter key pressed:', this.textsearch);
    }

}
