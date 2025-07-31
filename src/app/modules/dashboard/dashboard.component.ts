import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../../Services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchPipe } from '../../SearchPipe/search.pipe';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,SearchPipe,NgSelectModule,NgxPaginationModule,NgbPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('mySelect') mySelect!: NgSelectComponent;
filterMetadata = { count: 0 };
  page: number = 1;
  pageSize: number = 10;
  totalPages:number=0;
  poDetails:any[] = [];
  FilterPoDetails:any[] = [];
  textsearch: string = '';
  FromPODate: string | null = null;
  ToPODate: string | null = null;
  materialcodeList: any[] = [];
  selectedMaterialcodes: any[] = [];
  selectedMaterialcodesText: string = '';
  dateDisplay = 'none'
  poPopupDisplay = 'none'
  matCodePopupDisplay = 'none'
  etaPopupDisplay = 'none'
  selectedFromPO: number | null = null;
  selectedToPO: number | null = null;
  selectedFromMatCode: number | null = null;
  selectedToMatCode: number | null = null;
  fromETA: string | null = null;
  toETA: string | null = null;
  poPopUp : boolean = false;

   constructor(public router: Router, private modalService: SupplierService,private route: Router) {
    }

   ngOnInit() {
      this.getPoDetails()
   }

 getPoDetails() {
    this.modalService.getPoDetails().subscribe((_result: any) => {
      this.poDetails = _result;
      this.FilterPoDetails = [...this.poDetails]
      this.materialcodeList = []
      for(let item of this.FilterPoDetails){
        this.materialcodeList.push(item.materialcode)
      }
    })
  }

 openDeliverySchedule(PONumber: any, status:any, suppliername:any) {
  console.log("entetrr",PONumber,status,suppliername)
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

  toggleMaterialCodeSelection(): void {
  // Dynamically update the button text if needed (already handled by ng-select directly)
  this.selectedMaterialcodesText = this.selectedMaterialcodes.map(code => code).join(', ') || '---Select---';
  this.filterTableData();
}

selectAll(val:any) {
  if(val) {
    this.selectedMaterialcodes = this.materialcodeList.map( account => account);
    this.mySelect.close();
  } else {
    this.selectedMaterialcodes = [];
  }
  console.log(val);
}

 filterTableData() {

  if (this.selectedMaterialcodes.length ||this.FromPODate||this.ToPODate) {
   
    console.log('Selected From date:', this.FromPODate);

    const frompodate = new Date(new Date(String(this.FromPODate)).getFullYear(),
    new Date(String(this.FromPODate)).getMonth(), new Date(String(this.FromPODate)).getDate())
    frompodate.toString(); // Convert back to string format
    const topodate = new Date(new Date(String(this.ToPODate)).getFullYear(),
    new Date(String(this.ToPODate)).getMonth(), new Date(String(this.ToPODate)).getDate())
    topodate.toString(); 

    
    console.log('Selected To date:', topodate);

    this.FilterPoDetails = this.poDetails.filter(data => {
      const [year, month, day] = data.etd.split("-").map(Number); // Convert each part to a number
      const POdate  = new Date(year, month - 1, day); // Month is zero-based
      console.log(Number(data.ponumber)); 
      return(!this.FromPODate  ||POdate >= frompodate)
       && (!this.ToPODate  ||POdate <= topodate)
       && (!this.selectedMaterialcodes?.length || this.selectedMaterialcodes.some(item => item === data.materialcode))
    });
    console.log("iiii",this.poDetails)
  } else {
    this.FilterPoDetails = [...this.poDetails];
  }
}

filterByArrivalDays(filterpodetails: any[], daysAgo: number): any[] {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - daysAgo);

  return filterpodetails.filter(po => {
    if (!po.eta) return false; // Skip if actualarrival is null
    const arrivalDate = new Date(po.eta);
    return arrivalDate >= fromDate && arrivalDate <= today;
  });
}
etaOptions = [
  { value: '', label: 'Select ETA Range' },
  { value: '19', label: 'Last 1 Day' },
  { value: '20', label: 'Last 2 Days' },
  { value: '21', label: 'Last 3 Days' },
  { value: '25', label: 'Last 7 Days' }
];

onEtaFilterChange(days: any) {
  this.filterTableData();
  const numDays = parseInt(days.value, 10);
  if (!isNaN(numDays)) {
    this.FilterPoDetails = this.filterByArrivalDays(this.FilterPoDetails, numDays);
  } else {
    // No filter selected; show all or handle as needed
    this.FilterPoDetails = [...this.FilterPoDetails];
  }
}

ClearControls()
{
  this.FromPODate='';
  this.ToPODate='';
  this.FilterPoDetails = [...this.poDetails];
 
}

onPageChange(page: number) {
  this.page = page;
  //this.updatePagination();
}

  goBack(): void {
    window.history.back();
  }

  applyPOFilter() {
  if(this.poPopUp){
    if (this.selectedFromPO != null && this.selectedToPO != null) {
      const from = Math.min(this.selectedFromPO, this.selectedToPO);
      const to = Math.max(this.selectedFromPO, this.selectedToPO);

      this.FilterPoDetails = this.poDetails.filter(row => {
        const poNumber = Number(row.ponumber);
        return poNumber >= from && poNumber <= to;
      });
    }
  } else{
     if (this.selectedFromMatCode != null && this.selectedToMatCode != null) {
      const from = Math.min(this.selectedFromMatCode, this.selectedToMatCode);
      const to = Math.max(this.selectedFromMatCode, this.selectedToMatCode);

      this.FilterPoDetails = this.poDetails.filter(row => {
        const materialcode = Number(row.materialcode);
        return materialcode >= from && materialcode <= to;
      });
    }
  }
 
  this.closePOPopup();
}

applyEtaFilter() {
  if (this.fromETA && this.toETA) {
    const fromDate = new Date(this.fromETA);
    const toDate = new Date(this.toETA);

    this.FilterPoDetails = this.poDetails.filter(row => {
      const etaDate = new Date(row.eta);
      return etaDate >= fromDate && etaDate <= toDate;
    });
  }

  this.closeEtaPopup();
}

  closePOPopup() {
  this.poPopupDisplay = 'none';
  this.selectedFromPO = null;
  this.selectedToPO = null;
  this.matCodePopupDisplay = 'none';
  this.selectedFromMatCode = null;
  this.selectedToMatCode = null;
}

closeEtaPopup(){
  this.etaPopupDisplay = 'none';
}


}
