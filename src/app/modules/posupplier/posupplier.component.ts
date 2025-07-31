import { Component,OnInit, ViewEncapsulation,NgModule, ViewChild } from '@angular/core';
import { FormControl,FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../Services/supplier.service';
import { Router } from '@angular/router';
import { Podetails, ponos } from '../../models/podetails';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgxSpinnerService } from 'ngx-spinner';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Supplier } from '../../models/supplier';
import { SearchPipe } from '../../SearchPipe/search.pipe';
import { ToastrService } from 'ngx-toastr';
// import * as XLSX from 'xlsx';

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

  selectedFile!: File | undefined;
  display = "none";
  dateDisplay = 'none'
  poPopupDisplay = 'none'
  selectedfilename:string='';
  showError1: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  selectedFromPO: number | null = null;
  selectedToPO: number | null = null;
  constructor(private modulesService: SupplierService,public toastr: ToastrService, private route: Router) { 
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

  //excel download

Downloadtemplate()
 {
   const excelFilePath = 'assets/UpoadPurches order Example.xlsx';
   this.downloadExcelFile(excelFilePath,'UpoadPurches order Example.xlsx');
 }

downloadExcelFile(filePath : string,filename : string): void {
   // Path to your Excel file in the assets folder
  fetch(filePath)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Set your desired file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
}

 openUploadModal(): void {
   this.selectedFile=undefined;
   //this.uploadDisplay = 'block';
   this.display = "block";
   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
   fileInput.value = '';
  // this.uploadfromdate='';
 }

   onCloseHandled() {
   this.showError1=false;
   this.display = "none";
   this.dateDisplay = "none";
   this.selectedfilename='';
   this.fromDate='';
   this.toDate='';
   this.ClearControls();
  }

  submitDate(){
    this.FromPODate = this.fromDate;
    this.ToPODate = this.toDate;
    this.filterTableData()
    this.dateDisplay = "none";
    this.fromDate='';
    this.toDate='';
  }

  closePOPopup() {
  this.poPopupDisplay = 'none';
  this.selectedFromPO = null;
  this.selectedToPO = null;
}



   onFileSelected(event: any): void {
   const file: File = event.target.files[0];
  this.selectedFile = file;
  this.selectedfilename = file.name;
  // const reader: FileReader = new FileReader();
  // reader.onload = (e: any) => {
  //   const data = new Uint8Array(e.target.result);
  //   const workbook = XLSX.read(data, { type: 'array' });
  //   const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

  //   const headerRowIndex = 7;
  //   const fileHeaders = sheetData[headerRowIndex] as string[];
  //   //this.selectedFile = undefined;

  //   // if (!this.validateHeaders(fileHeaders, expectedHeaders)) {
  //   //   this.toastr.error('Excel headers are incorrect or not in the correct order.');
  //   //   this.selectedFile = undefined;
  //   //   return;
  //   // }

  //   const dataRows = sheetData.slice(headerRowIndex + 1) as any;
  //   // if (!this.validateMandatoryFields(dataRows, fileHeaders, mandatoryFields)) {
  //   //   this.toastr.error('Mandatory fields (Part Name, Displacement, Current Program, BomQty) are missing in one or more rows.');
  //   //   this.selectedFile = undefined;
  //   //   return;
  //   // }

  //   this.toastr.success('Excel file is valid.');
  // };
  // reader.readAsArrayBuffer(file);
}

uploadExcel(): void {
  
  if (!this.selectedFile) {
  this.toastr.error("No file selected or file failed validation.");
  return;
}

this.sendExcelDataToAPI(this.selectedFile);
}



sendExcelDataToAPI(uploadfile: File): void {


  //this.SpinnerService.show('spinner');

  this.modulesService.uploadExcelData(uploadfile).subscribe(
    { next: (_res: any) => {
      if(_res==true){
      console.log('Excel data uploaded successfully:', _res);
      this.toastr.success("Data Uploaded Successfully.");
      this.onCloseHandled();
      this.GetSuppliers();
      //this.SpinnerService.hide('spinner');
      }
      
    },
    error: (error: any) => {
      console.error('API call error:', error);
    },}
    
  );
  //row.editable = false;  // Disable edit mode after successful update




  
}
  
goBack(): void {
    window.history.back();
  }

  GetSuppliers() {
    this.Suppliers = [];
    const storedRoleId = localStorage.getItem("roleId");
    if(storedRoleId=='3')
    {
      this.SupplierId=3;
      this.SupplierName="Admin";
      this.FillPODropdown();
      this.FillPOTable();
    }
    // this.tableData.forEach((data) => {
    //   if (!this.departmentHeads.includes(data.DepartmentHead)) {
        // this.PONumbers.push("5000051930");
        // this.PONumbers.push("5000051910");
        // this.PONumbers.push("5000051940");
      // }
      else
      {
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

  this.modulesService.getPOHeaders(this.SupplierCode).subscribe({
    next: (response: any) => {
      //this.POTableData = response;
      this.POTableData = response.filter((item: any) => item.isPODeleted !== 'L');

      this.filteredTableData = [...this.POTableData];
      this.Status=Array.from(
        new Set(this.filteredTableData.map(item => item.status))
      );
      console.log("API response", this.POTableData);
      console.log("filter",this.filteredTableData);
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

get fromDropdownOptions(): ponos[] {
  return this.PONumbers.filter(po => po.poNumber !== this.selectedToPO);
}

get toDropdownOptions(): ponos[] {
  return this.PONumbers.filter(po => po.poNumber !== this.selectedFromPO);
}
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
      return (!this.selectedPOs?.length ||  this.selectedPOs.some(selectedPO => selectedPO.poNumber == Number(data.poNumber)))
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

applyPOFilter() {
  if (this.selectedFromPO != null && this.selectedToPO != null) {
    const from = Math.min(this.selectedFromPO, this.selectedToPO);
    const to = Math.max(this.selectedFromPO, this.selectedToPO);

    this.filteredTableData = this.POTableData.filter(row => {
      const poNumber = Number(row.poNumber);
      return poNumber >= from && poNumber <= to;
    });
  }
  this.closePOPopup();
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


