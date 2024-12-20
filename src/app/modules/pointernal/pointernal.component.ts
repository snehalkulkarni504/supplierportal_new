import { Component,OnInit,ViewChild,ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl,FormGroup,FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { Podetails, ponos } from '../../models/podetails';
import { SupplierService } from '../../Services/supplier.service';
import { Supplier } from '../../models/supplier';
import { SearchPipe } from '../../SearchPipe/search.pipe';

@Component({
  selector: 'app-pointernal',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, NgxPaginationModule,
    NgbPaginationModule,NgSelectModule,SearchPipe],
  templateUrl: './pointernal.component.html',
  styleUrl: './pointernal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class pointernalComponent {
  @ViewChild('FromPODateCalendar') private FromPODateCalendar: any;
  @ViewChild('ToPODateCalendar') private ToPODateCalendar: any;
  @ViewChild('mySelectSupp') mySelectSupp!: NgSelectComponent;
  @ViewChild('mySelect') mySelect!: NgSelectComponent;
  SupplierName: string = "Akcome Metals Technology (Nantong) LTD";
  myPlaceHolder='----Select----';
  PONumbers: ponos[] = [];
  Suppliers: Supplier[] = [];
  selectedsuppliers: Supplier[] = [];
  Status: string[] = ["Open","WIP","Closed"];
  selectedPOs: ponos[] = [];
  selectedstatus: string[] = [];
  FromPODate: string | null = null;
  ToPODate: string | null = null;
  timesheetDH!: FormGroup
  POTableData: Podetails[] = [];
  filteredTableData: Podetails[] = [];
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalPages:number=0;
  selectedStatusText: string = '---Select---';
  filterMetadata = { count: 0 };
  POInternalScreen!: FormGroup;
  constructor(private modulesService: SupplierService,private route: Router)
  {}

  

  ngOnInit():void {
    this.POInternalScreen = new FormGroup({
      textsearch: new FormControl(),
      FromPODate:new FormControl(),
      ToPODate:new FormControl()
    });
    this.FillPODropdown();
    this.FillSupplierDropdown();
    this.FillPOTable();
  }

  openDeliverySchedule(PONumber: any, status:any, suppliername:any) {
    // Navigate to the 'details' component with the specified ID
    // this.route.navigate(['/poschedule', PONumber]);
    this.route.navigate(['/module/poschedule'], {
      queryParams: {
        PONumber: PONumber,
        postatus: status,
        suppliername: suppliername,
        page: "internal"
      },
    });

  }
  
  async FillPODropdown() {
    //this.PONumbers = [];
    console.log("Supplier", this.selectedsuppliers);
    // this.tableData.forEach((data) => {
    //   if (!this.departmentHeads.includes(data.DepartmentHead)) {
        // this.PONumbers.push("5000051930");
        // this.PONumbers.push("5000051910");
        // this.PONumbers.push("5000051940");
      // }
      await this.modulesService.getPONumber(null).subscribe({
        next: (response:any) => {
          this.PONumbers = response;
          console.log("PONumbers", this.PONumbers);
          if (this.selectedsuppliers.length>0)
          {
            const filteredpo = this.PONumbers.filter(x => 
            this.selectedsuppliers.some(y=> y.suppliercode=== x.supplierCode))
            console.log("filtered", filteredpo);
            this.PONumbers=filteredpo
          }
          
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


async FillSupplierDropdown() {
  this.Suppliers = [];

  // this.tableData.forEach((data) => {
  //   if (!this.departmentHeads.includes(data.DepartmentHead)) {
      // this.PONumbers.push("5000051930");
      // this.PONumbers.push("5000051910");
      // this.PONumbers.push("5000051940");
    // }
    await this.modulesService.getsuppliers().subscribe({
      next: (response:any) => {
        this.Suppliers = response;
        console.log("FillSupplierDropdown", this.Suppliers);
        
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

  await this.modulesService.getPOHeaders(null).subscribe({
    next: (response:any) => {
      this.POTableData = response;
      this.filteredTableData = [...this.POTableData];
      console.log("API response", this.POTableData);
      //this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
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


// addpo (poNumber: number,
//   poDate :string,
//   docType : string,
//   status: string,
//   supplierremark :string,
//   tpsremark : string) {
//   const product: podetails = { poNumber, poDate, docType, status,supplierremark,tpsremark};
//   this.POTableData.push(product);
// }

filterTableData() {
  console.log('selectedpos',this.selectedPOs);
  console.log('podata',this.filteredTableData);
  if (this.selectedPOs.length||this.selectedstatus||this.FromPODate||this.ToPODate) {
     console.log('Selected From date:', new Date(String(this.FromPODate)));
    // console.log('Selected To date:', new Date(this.ToPODate));
    
    const frompodate = new Date(new Date(String(this.FromPODate)).getFullYear(),
    new Date(String(this.FromPODate)).getMonth(), new Date(String(this.FromPODate)).getDate())
    frompodate.toString(); // Convert back to string format
    const topodate = new Date(new Date(String(this.ToPODate)).getFullYear(),
    new Date(String(this.ToPODate)).getMonth(), new Date(String(this.ToPODate)).getDate())
    topodate.toString(); 


    this.filteredTableData = this.POTableData.filter(data => {
      const [day, month, year] = data.poDate.split("-").map(Number); // Convert each part to a number
      const POdate  = new Date(year, month - 1, day); // Month is zero-based
      console.log('Selected From date:', frompodate);
      console.log('POdate:', POdate);
      return (!this.selectedsuppliers?.length ||  this.selectedsuppliers.some(selectedSupp => selectedSupp.suppliercode === data.supplierCode))
       && (!this.selectedPOs?.length ||  this.selectedPOs.some(selectedPO => Number(selectedPO.poNumber) === Number(data.poNumber)))
       && (!this.selectedstatus?.length || this.selectedstatus.includes(data.status))
       && (!this.FromPODate  || POdate >=frompodate)
       && (!this.ToPODate  || POdate <= topodate)
    });
  } else {
    this.filteredTableData = [...this.POTableData];
  }
  //this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
  //this.updatePagination();
}


ClearControls()
{
  this.selectedsuppliers=[];
  this.selectedPOs = [];
  this.FromPODate='';
  this.ToPODate='';
  this.selectedstatus=[];
  this.filteredTableData=this.POTableData;
  this.FillPODropdown();
  //this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
  //this.updatePagination();

  const suppCheckboxes = document.querySelectorAll('.supp-checkbox') as NodeListOf<HTMLInputElement>;
  suppCheckboxes.forEach((checkbox) => (checkbox.checked = false));

  const poCheckboxes = document.querySelectorAll('.po-checkbox') as NodeListOf<HTMLInputElement>;
  poCheckboxes.forEach((checkbox) => (checkbox.checked = false));

  const statusCheckboxes = document.querySelectorAll('.status-checkbox') as NodeListOf<HTMLInputElement>;
  statusCheckboxes.forEach((checkbox) => (checkbox.checked = false));
}

// onSearch(): void {
//   const query = this.searchQuery.toLowerCase();  // Convert the query to lowercase for case-insensitive search
//   this.filteredTableData = this.POTableData.filter(item =>
//     Object.values(item).some(value =>
//       value.toString().toLowerCase().includes(query)  // Check if any value contains the search query
//     )
//   );
// }

// updatePagination(): void {
//   const startIndex = (this.page-1) * this.pageSize;
//   const endIndex = startIndex + this.pageSize;
//   console.log('filtered',this.filteredTableData)
//   this.paginatedData = this.filteredTableData.slice(startIndex, endIndex);
//   this.totalPages = this.filteredTableData.length; // Update total count
// }

async toggleSupplierSelection() {
  // const isChecked = (event.target as HTMLInputElement).checked;
  // if (isChecked) {
  //   this.selectedsuppliers.push(supp);
  // } else {
  //   const index = this.selectedsuppliers.indexOf(supp);
  //   if (index > -1) {
  //     this.selectedsuppliers.splice(index, 1);
  //   }
  // }
  // console.log('onchange',this.selectedsuppliers)
  await this.FillPODropdown();
  await this.filterTableData();
}

selectedPoText: string = '';

getSelectedPoText(): string {
  return this.selectedPOs.length > 0 
    ? this.selectedPOs.map(po => po.poNumber).join(', ') 
    : '---Select---';
}

togglePoSelection(): void {
  // Log the currently selected PO numbers
  console.log("Selected POs:", this.selectedPOs);

  // Dynamically update the button text if needed (already handled by ng-select directly)
  this.selectedPoText = this.selectedPOs.map(po => po.poNumber).join(', ') || '---Select---';

  console.log("this.selectedPOs",this.selectedPOs);
  // Apply filtering logic based on selected POs
  this.filterTableData();
  //this.FillPODropdown();
}

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

selectAllsupplier(val:any) {
  if(val) {
    this.selectedsuppliers = this.Suppliers.map( account => account);
    this.mySelectSupp.close();
  } else {
    this.selectedsuppliers = [];
  }
  console.log(val);
}

selectAllPO(val:any) {
  if(val) {
    this.selectedPOs = this.PONumbers.map( account => account);
    this.mySelect.close();
  } else {
    this.selectedPOs = [];
  }
  console.log(val);
}



onPageChange(page: number) {
  this.page = page;
  //this.updatePagination();
}

goBack(): void {
  window.history.back();
}
}
