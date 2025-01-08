import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../../../Services/report.service';
import { lotdeletiondetails, Po_details } from '../../../models/podetails';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { SearchPipe } from '../../../SearchPipe/search.pipe';
import * as XLSX from 'xlsx';


interface MenuItem {
  text: string;
  value: string;
  selected: boolean;
  children?: MenuItem[];
}

interface NewRole {
  id: number
  rolename: string;
  description: string;
  status: string;
  menuSelection: MenuItem[];
}
interface Menu {
  value: string;
  text: string;
  selected?: boolean;
  children?: Menu[]; 
}


@Component({
  selector: 'app-lot-deletion-report',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbPaginationModule,NgxPaginationModule,SearchPipe,NgSelectModule],
  templateUrl: './lot-deletion-report.component.html',
  styleUrl: './lot-deletion-report.component.css'
})
export class LotDeletionReportComponent {
  constructor(public service: ReportService, public cdr: ChangeDetectorRef) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 5
    };
   }

   PODetailsreportsForm!: FormGroup;

  // lotdeletion_deatils: lotdeletiondetails[] = [];
  lotdeletion_deatils: lotdeletiondetails[] = [];
  searchQuery: string = '';
  
  filteredData: any[] = [];
  page: number = 1;

  supplierOptions: any[] = [];
  poOptions: any[] = [];

  selectedSuppliers: string[] = [];
  selectedPOs: number[] = [];
  fromDate: string | null = null;
  toDate: string | null = null;

  filterMetadata = { count: 0 };

  textsearch: string = '';

    pageSize: number = 5;
    config: any;
    currentPage = 1;
    itemsPerPage = 5;

  ngOnInit(): void {

    this.PODetailsreportsForm = new FormGroup({
      textsearch: new FormControl(),
      fromDate:new FormControl(),
      toDate:new FormControl(),
    });

    this.fetchpodetails()
  }

  formatDates(): void {
    // this.lotdeletion_deatils = this.lotdeletion_deatils.map(item => {
    //   return {
    //     ...item,
    //     etd: this.formatDate(item.etd),
    //     eta: this.formatDate(item.eta)  
    //   };
    // });
  }

  formatDate(date: string): string {
    const dateObj = new Date(date); 

    if (isNaN(dateObj.getTime())) {
      return ''; 
    }

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }); 
    const year = dateObj.getFullYear();

    return `${day < 10 ? '0' + day : day}-${month}-${year}`;
  }

  fetchpodetails() {
    debugger;
    this.service.getLotDeletionDetails().subscribe(
      (data: any[]) => {
        this.lotdeletion_deatils = data;

        console.log("lotdeletion_deatils",this.lotdeletion_deatils);
        this.formatDates();  
        this.filteredData = [...this.lotdeletion_deatils];

        // Populate dropdown options
        // this.supplierOptions = [...new Set(data.map(item => item.suppliername))];
        this.poOptions = [...new Set(data.map(item => item.poNumber))];

        console.log("Data fetched and formatted successfully", data);
      },
      (error:any) => {
        console.error("Error fetching PO details", error);
      }
    );
  }

  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase(); 
  //   this.filteredData = this.lotdeletion_deatils.filter(item =>
  //     Object.values(item).some(value =>
  //       value.toString().toLowerCase().includes(query)
  //     )
  //   );
  // }

  onViewClick(): void {
    this.applyFilters();
  }

  podata:any

  applyFilters(): void {
    // this.filteredData = this.lotdeletion_deatils.filter(item => {
    //   const isSupplierMatch = this.selectedSuppliers.length === 0 || this.selectedSuppliers.includes(item.poNumber);
    //   const isPoMatch = this.selectedPOs.length === 0 || this.selectedPOs.includes(item.po);
    //   const isFromDateMatch = !this.fromDate || new Date(item.createDate) >= new Date(this.fromDate);
    //   const isToDateMatch = !this.toDate || new Date(item.eta) <= new Date(this.toDate);

    //   return isSupplierMatch && isPoMatch && isFromDateMatch && isToDateMatch;

    // });
    
  }

  toggleSupplierSelection(supplier: string, event: Event): void {
    debugger;
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedSuppliers.push(supplier);
    } else {
      const index = this.selectedSuppliers.indexOf(supplier);
      if (index > -1) {
        this.selectedSuppliers.splice(index, 1);
      }
    }
    this.applyFilters();
    this.poOptions = [...new Set(this.filteredData.map(item => item.poNumber))];
  }


  togglePoSelection(po: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedPOs.push(po);
    } else {
      const index = this.selectedPOs.indexOf(po);
      if (index > -1) {
        this.selectedPOs.splice(index, 1);
      }
    }
    this.applyFilters();
  }

  onClearClick(): void {
    this.selectedSuppliers = [];
    this.selectedPOs = [];
    this.fromDate = null;
    this.toDate = null;

    this.filteredData = [...this.lotdeletion_deatils];

    const supplierCheckboxes = document.querySelectorAll('.supplier-checkbox') as NodeListOf<HTMLInputElement>;
    supplierCheckboxes.forEach((checkbox) => (checkbox.checked = false));

    const poCheckboxes = document.querySelectorAll('.po-checkbox') as NodeListOf<HTMLInputElement>;
    poCheckboxes.forEach((checkbox) => (checkbox.checked = false));

    this.cdr.detectChanges();
    this.poOptions = [...new Set(this.filteredData.map(item => item.poNumber))];
  }



  goBack(): void {
    window.history.back();
  }


  downloadExcel(): void {
    const table = document.querySelector('table'); // Reference to your table
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.lotdeletion_deatils);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PO Details');
    XLSX.writeFile(wb, 'PODetailsReport.xlsx');
}


}
