import { Component,OnInit, ViewEncapsulation,NgModule, ViewChild } from '@angular/core';
import { FormControl,FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../Services/supplier.service';
import { Router } from '@angular/router';
import { Podetails, ponos } from '../../models/podetails';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Supplier } from '../../models/supplier';
import { SearchPipe } from '../../SearchPipe/search.pipe';

//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//import { faEdit } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-posupplier',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, NgxPaginationModule,
     NgbPaginationModule,NgSelectModule,SearchPipe],
  templateUrl: './posupplier.component.html',
  styleUrl: './posupplier.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class POsupplierComponent implements OnInit {
  @ViewChild('mySelect') mySelect!: NgSelectComponent;
  SupplierId: number|null = Number(localStorage.getItem("supplierId"));
  SupplierName: string |null = "";
  SupplierCode : string |null= "";
  myPlaceHolder='----Select----';
  PONumbers: ponos[] = [];
  SelectedPONumber :any;
  filterMetadata = { count: 0 };
  
  Status: string[] =[];
  selectedPOs: ponos[] = [];
  selectedstatus: string[] = [];
  selectedStatusText: string = '---Select---';
  // selectedstatus: string[] = [];
  FromPODate: string | null = null;
  ToPODate: string | null = null;
  POSupplierScreen!: FormGroup;
  POTableData: Podetails[] = [];
  filteredTableData: Podetails[] = [];
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalPages:number=0;
  Suppliers: Supplier[] = [];
  
  constructor(private modulesService: SupplierService, private route: Router) { 
   }

  ngOnInit() {
    this.POSupplierScreen = new FormGroup({
      textsearch: new FormControl(),
      FromPODate:new FormControl(),
      ToPODate:new FormControl()
    });
    this.GetSuppliers();
    
  }

  openDeliverySchedule(PONumber: string,postatus: string,suppliername: string | null) {
    // Navigate to the 'details' component with the specified ID
    debugger;
    if (suppliername===null)
    {
      suppliername='';
    }

    this.route.navigate(['/module/poschedule'], {
      queryParams: {
        PONumber: PONumber,
        postatus: postatus,
        suppliername: suppliername,
        page: "supplier"
      },
    });

    // this.route.navigate(['/module/poschedule'], {
    //   queryParams: {
    //     PONumber: PONumber,
    //     postatus: postatus,
    //     suppliername: suppliername
    //   },
    // });
    // this.route.navigate(['/module/poschedule', PONumber,postatus,suppliername]);
  }
  
  goBack(): void {
    window.history.back();
  }

  GetSuppliers() {
    this.Suppliers = [];
  
    // this.tableData.forEach((data) => {
    //   if (!this.departmentHeads.includes(data.DepartmentHead)) {
        // this.PONumbers.push("5000051930");
        // this.PONumbers.push("5000051910");
        // this.PONumbers.push("5000051940");
      // }
      this.modulesService.getsuppliers().subscribe({
        next: (response:any) => {
          this.Suppliers = response;
          console.log("FillSupplierDropdown", this.SupplierId);
          const loginsupplier=this.Suppliers.find(person => person.supplierid==this.SupplierId);
          this.SupplierCode=loginsupplier?loginsupplier.suppliercode:null;
          this.SupplierName=loginsupplier?loginsupplier.suppliername:null;
          this.FillPODropdown();
          this.FillPOTable();
          //this.updatePagination();
        },
        error: (e:any) => {
          //this.spinnerService.hide();
          console.error("Error fetching data from API:", e);
        },
        complete: () => {
          // Additional logic after API call completion
          //this.spinnerService.hide();
        },
      });
  }


  async FillPODropdown() {
     this.PONumbers = [];
    // this.tableData.forEach((data) => {
    //   if (!this.departmentHeads.includes(data.DepartmentHead)) {
        // this.PONumbers.push("5000051930");
        // this.PONumbers.push("5000051910");
        // this.PONumbers.push("5000051940");
      // }
      await this.modulesService.getPONumber(this.SupplierCode).subscribe({
        next: (response:any) => {
          this.PONumbers = response;
          console.log("API response", this.PONumbers);
        },
        error: (e:any) => {
          //this.spinnerService.hide();
          console.error("Error fetching data from API:", e);
        },
        complete: () => {
          // Additional logic after API call completion
          //this.spinnerService.hide();
        },
      });
}

async FillPOTable(){
  this.POTableData=[];
  // this.addpo(5000051910,"2014-10-20","Non Eng. PO","Completed",'','');
  // this.addpo(5000051920,"2014-09-25","Non Eng. PO","New",'To be Scheduled on 29-Nov-24','');
  // this.addpo(5000051930,"2014-09-30","Non Eng. PO","New",'','Update the delivery Schedule');
  // this.addpo(5000051940,"2014-09-20","Non Eng. PO","New",'','Update the delivery Schedule');
  // this.addpo(5000051950,"2014-09-22","Non Eng. PO","Completed",'','Update the delivery Schedule');
  // this.addpo(5000051960,"2014-09-25","Non Eng. PO","New",'','Update the delivery Schedule');
  // this.addpo(5000051970,"2014-09-27","Non Eng. PO","New",'','Update the delivery Schedule');
  // this.addpo(5000051980,"2014-09-28","Non Eng. PO","New",'','Update the delivery Schedule');
  // this.addpo(5000051990,"2014-10-03","Non Eng. PO","New",'','Update the delivery Schedule');

  this.modulesService.getPOHeaders(this.SupplierCode).subscribe({
    next: (response: any) => {
      this.POTableData = response;
      this.filteredTableData = [...this.POTableData];
      this.Status=Array.from(
        new Set(this.filteredTableData.map(item => item.status))
      );
      console.log("API response", this.POTableData);
      // this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
      //this.updatePagination();
    },
    error: (e: any) => {
      //this.spinnerService.hide();
      console.error("Error fetching data from API:", e);
    },
    complete: () => {
      // Additional logic after API call completion
      //this.spinnerService.hide();
    },
  });
}


// addpo (poNumber: number,
//   poDate :string,
//   docType : string,
//   status: string,
//   supplierremark :string,
//   tpsremark : string) {
//   const product: podetails = { poNumber, poDate, docType, status,supplierremark,tpsremark};
//   this.POTableData.push(product);
// }

selectedPoText: string = '';

getSelectedPoText(): string {
  return this.selectedPOs.length > 0 
    ? this.selectedPOs.map(po => po.poNumber).join(', ') 
    : '---Select---';
}

filterTableData() {
  console.log(this.selectedPOs);
  if (this.selectedPOs.length||this.selectedstatus||this.FromPODate||this.ToPODate) {
   
    console.log('Selected From date:', this.FromPODate);

    const frompodate = new Date(new Date(String(this.FromPODate)).getFullYear(),
    new Date(String(this.FromPODate)).getMonth(), new Date(String(this.FromPODate)).getDate())
    frompodate.toString(); // Convert back to string format
    const topodate = new Date(new Date(String(this.ToPODate)).getFullYear(),
    new Date(String(this.ToPODate)).getMonth(), new Date(String(this.ToPODate)).getDate())
    topodate.toString(); 

    
    console.log('Selected To date:', topodate);

    this.filteredTableData = this.POTableData.filter(data => {
      const [day, month, year] = data.poDate.split("-").map(Number); // Convert each part to a number
      const POdate  = new Date(year, month - 1, day); // Month is zero-based
      console.log(Number(data.poNumber)); 
      return (!this.selectedPOs?.length ||  this.selectedPOs.some(selectedPO => selectedPO.poNumber === Number(data.poNumber)))
       && (!this.selectedstatus?.length || this.selectedstatus.some(selectstatus=>selectstatus===data.status))
       && (!this.FromPODate  ||POdate >= frompodate)
       && (!this.ToPODate  ||POdate <= topodate)
    });
  } else {
    this.filteredTableData = [...this.POTableData];
  }
  // this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
   //this.updatePagination();
}
//   onItemSelect(item: any) {
//     console.log('onItemSelect', item);
//     //this.selectedPOs.push(item)
//     console.log(this.selectedPOs);
// } 
// onItemDeSelect(item: any) {
//     console.log('onItemDeSelect', item);
//     const index = this.selectedPOs.indexOf(item); // Find the index of the value
//   if (index !== -1) {
//     this.selectedPOs.splice(index, 1); // Remove the item
//   }
//   console.log(this.selectedPOs);
// }
// onSelectAll(items: any) {
//     console.log('onSelectAll', items);
//     this.selectedPOs=this.PONumbers;
// }
// onUnSelectAll() {
//   this.selectedPOs=[];
//     console.log('onUnSelectAll fires');
// }


ClearControls()
{
  this.selectedPOs = [];
  this.FromPODate='';
  this.ToPODate='';
  this.selectedstatus=[];
  this.filteredTableData=this.POTableData;
  // this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
  //this.updatePagination();

  // const poCheckboxes = document.querySelectorAll('.po-checkbox') as NodeListOf<HTMLInputElement>;
  // poCheckboxes.forEach((checkbox) => (checkbox.checked = false));

  // const statusCheckboxes = document.querySelectorAll('.status-checkbox') as NodeListOf<HTMLInputElement>;
  // statusCheckboxes.forEach((checkbox) => (checkbox.checked = false));
}

onSearch(): void {
  const query = this.textsearch.toLowerCase();  // Convert the query to lowercase for case-insensitive search
  this.filteredTableData = this.POTableData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(query)  // Check if any value contains the search query
    )
  );
  // this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
  //this.updatePagination();
}

// updatePagination(): void {
//   const startIndex = (this.page-1) * this.pageSize;
//   const endIndex = startIndex + this.pageSize;
//   console.log('filtered',this.filteredTableData)
//   this.paginatedData = this.filteredTableData.slice(startIndex, endIndex);
//   this.totalPages = this.filteredTableData.length; // Update total count
// }


// goToPage(page: number): void {
//   this.currentPage = page;
//   this.updatePagination();
// }

// prevPage(): void {
//   if (this.currentPage > 1) {
//     this.currentPage--;
//     this.updatePagination();
//   }
// }

// nextPage(): void {
//   if (this.currentPage < this.totalPages) {
//     this.currentPage++;
//     this.updatePagination();
//   }
// }

togglePoSelection(): void {
  // Log the currently selected PO numbers
  console.log("Selected POs:", this.selectedPOs);

  // Dynamically update the button text if needed (already handled by ng-select directly)
  this.selectedPoText = this.selectedPOs.map(po => po.poNumber).join(', ') || '---Select---';

  console.log("this.selectedPOs",this.selectedPOs);
  // Apply filtering logic based on selected POs
  this.filterTableData();
}


// togglePoSelection(po: any, event: Event): void {
//   const isChecked = (event.target as HTMLInputElement).checked;
//   // console.log("PO Test:",po);
//   this.selectedPoText= po.poNumber;
//   if (isChecked) {
//     this.selectedPOs.push(po);
//   } else {
//     const index = this.selectedPOs.indexOf(po);
//     if (index > -1) {
//       this.selectedPOs.splice(index, 1);
//     }
//   }
//   this.filterTableData();
// }
// selectedStatusText:any;

toggleStatusSelection( value:any ): void {
  // const isChecked = (event.target as HTMLInputElement).checked;
  // if (isChecked) {
  //   this.selectedstatus.push(status);
  // } else {
  //   const index = this.selectedstatus.indexOf(status);
  //   if (index > -1) {
  //     this.selectedstatus.splice(index, 1);
  //   }
  // }

  console.log("this.selectedstatus",value);
  this.selectedStatusText = this.selectedstatus.length > 0 
    ? this.selectedstatus.join(', ') 
    : '---Select---';

  // this.selectedStatusText = this.selectedstatus.map(po => po.poNumber).join(', ') || '---Select---';


  this.filterTableData();
}

// toggleStatusSelection(status: any, event: Event): void {
//   const isChecked = (event.target as HTMLInputElement).checked;
//   if (isChecked) {
//     this.selectedstatus.push(status);
//   } else {
//     const index = this.selectedstatus.indexOf(status);
//     if (index > -1) {
//       this.selectedstatus.splice(index, 1);
//     }
//   }
//   this.filterTableData();
// }

onPageChange(page: number) {
  this.page = page;
  //this.updatePagination();
}

selectAll(val:any) {
  if(val) {
    this.selectedPOs = this.PONumbers.map( account => account);
    this.mySelect.close();
  } else {
    this.selectedPOs = [];
  }
  console.log(val);
}

}

function moment(dateString: any, arg1: string) {
  throw new Error('Function not implemented.');
}


