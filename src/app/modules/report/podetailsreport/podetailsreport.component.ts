import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../../../Services/report.service';
import { Po_details } from '../../../models/podetails';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { SearchPipe } from '../../../SearchPipe/search.pipe';
// import * as XLSX from 'xlsx';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Podetails,ponos } from '../../../models/podetails';
import { Supplier } from '../../../models/supplier';




 
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
  selector: 'app-podetailsreport',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbPaginationModule,NgxPaginationModule,SearchPipe,NgSelectModule],
  templateUrl: './podetailsreport.component.html',
  styleUrl: './podetailsreport.component.css'
})
export class PodetailsreportComponent {

  @ViewChild('mySelectSupp') mySelectSupp!: NgSelectComponent;

  PONumbers: ponos[] = [];
  Suppliers: Supplier[] = [];
  selectedsuppliers: Supplier[] = [];



  constructor(public service: ReportService, public cdr: ChangeDetectorRef) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 5
    };
   }

   PODetailsreportsForm!: FormGroup;

  Po_deatils: Po_details[] = [
    { suppliercode: '101', suppliername: 'ABC Corp', pono: 1, itemno: 1, materialcode: 'M001', materialdes: 'Steel Rod', materialqty: 100, materialuom: 'KG', etd: '2024-11-20', deliverystatus: 'Pending', eta: '2024-11-2' },
  ];

  searchQuery: string = '';
  
  filteredData: any[] = [];
  page: number = 1;

  supplierOptions: any[] = [];
  poOptions: any[] = [];
  materialcodeList: any[] = [];
  selectedMaterialcodes: any[] = [];
  selectedMaterialcodesText: string = '';

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
    this.Po_deatils = this.Po_deatils.map(item => {
      return {
        ...item,
        etd: this.formatDate(item.etd),
        eta: this.formatDate(item.eta)  
      };
    });
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
    this.service.getpodetails().subscribe(
      (data: any[]) => {
        this.Po_deatils = data;
        this.formatDates();  
        this.filteredData = [...this.Po_deatils];

        // Populate dropdown options
        this.supplierOptions = [...new Set(data.map(item => item.suppliername))];
        this.poOptions = [...new Set(this.Po_deatils.map(item => item.pono))];
        this.materialcodeList  = [...new Set(this.Po_deatils.map(item => item.materialcode))];


        console.log(this.materialcodeList);

        console.log("Data fetched and formatted successfully", data);
      },
      (error:any) => {
        console.error("Error fetching PO details", error);
      }
    );
  }

  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase(); 
  //   this.filteredData = this.Po_deatils.filter(item =>
  //     Object.values(item).some(value =>
  //       value.toString().toLowerCase().includes(query)
  //     )
  //   );
  // }

  onViewClick(): void {
    this.applyFilters();
  }


  // applyFilters(): void {
  //   this.filteredData = this.Po_deatils.filter(item => {
  //     const isSupplierMatch = this.selectedSuppliers.length === 0 || this.selectedSuppliers.includes(item.suppliername);
  //     const isPoMatch = this.selectedPOs.length === 0 || this.selectedPOs.includes(item.pono);
  //     const isFromDateMatch = !this.fromDate || new Date(item.eta) >= new Date(this.fromDate);
  //     const isToDateMatch = !this.toDate || new Date(item.eta) <= new Date(this.toDate);

  //     return isSupplierMatch && isPoMatch && isFromDateMatch && isToDateMatch;

  //   });
    
  // }


  applyFilters(): void {
    this.filteredData = this.Po_deatils.filter(item => {
      const isSupplierMatch = this.selectedSuppliers.length === 0 || this.selectedSuppliers.includes(item.suppliername);
      const isPoMatch = this.selectedPOs.length === 0 || this.selectedPOs.includes(item.pono);
      const isFromDateMatch = !this.fromDate || new Date(item.eta) >= new Date(this.fromDate);
      const isToDateMatch = !this.toDate || new Date(item.eta) <= new Date(this.toDate);
      const isSupplierMatCode = this.selectedMaterialcodes.length === 0 || this.selectedMaterialcodes.some(val => val === item.materialcode)
  
      return isSupplierMatch && isPoMatch && isFromDateMatch && isToDateMatch && isSupplierMatCode;
    });
  }
  
  
  
  


  toggleSupplierSelection(supplier: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      this.selectedSuppliers.push(supplier);
    } else {
      const index = this.selectedSuppliers.indexOf(supplier);
      if (index > -1) {
        this.selectedSuppliers.splice(index, 1);
      }
    }
  
    // Apply filters after updating the selected suppliers
    this.applyFilters();
    // Update PO options based on filtered data
    this.poOptions = [...new Set(this.filteredData.map(item => item.pono))];
  }

  onSupplierSelectionChange(event: any): void {
  this.selectedSuppliers = event; // Update selected suppliers
  this.applyFilters(); // Apply the filters after selection
}

  

onPONumberChange(selectedPOs: any[]): void {
  this.selectedPOs = selectedPOs;
  this.applyFilters();
}



isAllPoSelected(): boolean {
  return this.selectedPOs.length === this.poOptions.length;
}


toggleSelectAllPo(event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;

  if (isChecked) {
    this.selectedPOs = [...this.poOptions];
  } else {
    this.selectedPOs = [];
  }

  this.applyFilters();
}


onClearClick(): void {
  this.selectedSuppliers = [];
  this.selectedPOs = [];
  this.fromDate = null;
  this.toDate = null;

  this.filteredData = [...this.Po_deatils];

  if (this.mySelectSupp) {
    this.mySelectSupp.clearModel();
  }

  // Reset dropdown states
  const supplierCheckboxes = document.querySelectorAll('.supplier-checkbox') as NodeListOf<HTMLInputElement>;
  supplierCheckboxes.forEach((checkbox) => (checkbox.checked = false));

  const poCheckboxes = document.querySelectorAll('.po-checkbox') as NodeListOf<HTMLInputElement>;
  poCheckboxes.forEach((checkbox) => (checkbox.checked = false));

  // Recalculate the filtered PO options
  this.poOptions = [...new Set(this.filteredData.map(item => item.pono))];

  this.applyFilters();
  this.cdr.detectChanges();
}

 toggleMaterialCodeSelection(): void {
  // Dynamically update the button text if needed (already handled by ng-select directly)
  this.selectedMaterialcodesText = this.selectedMaterialcodes.map(code => code).join(', ') || '---Select---';
  this.applyFilters();
}

selectAll(val:any) {
  if(val) {
    this.selectedMaterialcodes = this.materialcodeList.map( account => account);
    this.mySelectSupp.close();
  } else {
    this.selectedMaterialcodes = [];
  }
  console.log(val);
}

  


  goBack(): void {
    window.history.back();
  }


  downloadExcel(): void {
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Po_deatils);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'PO Details');
    // XLSX.writeFile(wb, 'PODetailsReport.xlsx');
}




}
