import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../../../Services/report.service';
import { Po_details } from '../../../models/podetails';
 
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
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './podetailsreport.component.html',
  styleUrl: './podetailsreport.component.css'
})
export class PodetailsreportComponent {
  constructor(public service: ReportService, public cdr: ChangeDetectorRef) { }

  Po_deatils: Po_details[] = [
    { suppliercode: 101, suppliername: 'ABC Corp', pono: 1, itemno: 1, materialcode: 'M001', materialdes: 'Steel Rod', materialqty: 100, materialuom: 'KG', etd: '2024-11-20', deliverystatus: 'Pending', eta: '2024-11-2' },
    { suppliercode: 102, suppliername: 'XYZ Ltd', pono: 2, itemno: 2, materialcode: 'M002', materialdes: 'Iron Sheet', materialqty: 200, materialuom: 'SQM', etd: '2024-11-20', deliverystatus: 'Shipped', eta: '2024-11-12' },
    { suppliercode: 103, suppliername: 'DEF Inc', pono: 3, itemno: 3, materialcode: 'M003', materialdes: 'Copper Wire', materialqty: 150, materialuom: 'Meter', etd: '2024-11-20', deliverystatus: 'In Transit', eta: '2024-11-8' },
    { suppliercode: 104, suppliername: 'GHI Ltd', pono: 4, itemno: 4, materialcode: 'M004', materialdes: 'Aluminum Plate', materialqty: 75, materialuom: 'KG', etd: '2024-11-20', deliverystatus: 'Delivered', eta: '2024-11-10' },
    { suppliercode: 105, suppliername: 'JKL Corp', pono: 5, itemno: 5, materialcode: 'M005', materialdes: 'Brass Tube', materialqty: 120, materialuom: 'Meter', etd: '2024-11-20', deliverystatus: 'Pending', eta: '2024-11-11' },
    { suppliercode: 106, suppliername: 'MNO Industries', pono: 6, itemno: 6, materialcode: 'M006', materialdes: 'Stainless Steel', materialqty: 80, materialuom: 'KG', etd: '2024-11-20', deliverystatus: 'Shipped', eta: '2024-11-13' },
    { suppliercode: 107, suppliername: 'PQR Works', pono: 7, itemno: 7, materialcode: 'M007', materialdes: 'Titanium Bar', materialqty: 60, materialuom: 'KG', etd: '2024-11-20', deliverystatus: 'In Transit', eta: '2024-11-14' },
    { suppliercode: 108, suppliername: 'STU Fabrications', pono: 8, itemno: 8, materialcode: 'M008', materialdes: 'Carbon Fiber', materialqty: 30, materialuom: 'KG', etd: '2024-11-20', deliverystatus: 'Pending', eta: '2024-11-15' },
  ];

  searchQuery: string = '';
  textsearch: string = '';
  filteredData: any[] = [];

  supplierOptions: any[] = [];
  poOptions: any[] = [];

  selectedSuppliers: string[] = [];
  selectedPOs: number[] = [];
  fromDate: string | null = null;
  toDate: string | null = null;

  currentPage: number = 1; 
  itemsPerPage: number = 10;

  ngOnInit(): void {

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
        this.poOptions = [...new Set(data.map(item => item.pono))];

        console.log("Data fetched and formatted successfully", data);
      },
      (error:any) => {
        console.error("Error fetching PO details", error);
      }
    );
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase(); 
    this.filteredData = this.Po_deatils.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(query)
      )
    );
  }

  onViewClick(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredData = this.Po_deatils.filter(item => {
      const isSupplierMatch = this.selectedSuppliers.length === 0 || this.selectedSuppliers.includes(item.suppliername);
      const isPoMatch = this.selectedPOs.length === 0 || this.selectedPOs.includes(item.pono);
      const isFromDateMatch = !this.fromDate || new Date(item.eta) >= new Date(this.fromDate);
      const isToDateMatch = !this.toDate || new Date(item.eta) <= new Date(this.toDate);

      return isSupplierMatch && isPoMatch && isFromDateMatch && isToDateMatch;
    });
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

    this.filteredData = [...this.Po_deatils];

    const supplierCheckboxes = document.querySelectorAll('.supplier-checkbox') as NodeListOf<HTMLInputElement>;
    supplierCheckboxes.forEach((checkbox) => (checkbox.checked = false));

    const poCheckboxes = document.querySelectorAll('.po-checkbox') as NodeListOf<HTMLInputElement>;
    poCheckboxes.forEach((checkbox) => (checkbox.checked = false));

    this.cdr.detectChanges();
  }

  get Data() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }
  

  onPageChange(page: number): void {
    this.currentPage = page;
  }


  goBack(): void {
    window.history.back();
  }

}
