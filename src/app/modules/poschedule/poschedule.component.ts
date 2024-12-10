import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../Services/supplier.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DocuploadComponent } from '../docupload/docupload.component';


interface Lot {
  lotnumber: string;
  lotqty: number;
  etd: string;
  eta: string;
  actualdispatch: string;
  actualarrival: string;
  attachment: any; // You can specify the file type if needed
}

interface Child {
  itemno: string;
  partcode: string;
  description: string;
  itemqty: number;
  uom: string;
  lotdetails: Lot[];
  isExpand: boolean;
}

interface Parent {
  poNumber: string;
  poDate: string;
  docType: string;
  isExpand: boolean;
  items: Child[];
}

@Component({
  selector: 'app-poschedule',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './poschedule.component.html',
  styleUrl: './poschedule.component.css'
})
export class PoscheduleComponent implements OnInit {
  // Client and Schedule Info
  clientName = 'ABC Corporation';
  deliveryScheduleName = 'Weekly Delivery Schedule';
  @Input() UserID: any;
  @Input() PONumber: any;
  @Input() postatus:any;
  @Input() suppliername:any;
  Hide : boolean=false;
  //constructor(private poService: PoServicesService,private toastr: ToastrService){}
  //PONumber! :number;
  constructor(private poService: SupplierService,private toastr: ToastrService,
   private route: ActivatedRoute, private modalService: NgbModal){}

  ngOnInit(): void {
    if(this.suppliername=="" || this.postatus){
      this.Hide=true;
   }
   console.log("");
   this.PONumber = Number(this.route.snapshot.paramMap.get('PONumber') || '0');
   this.UserID=Number(localStorage.getItem("mst_user_id"));
   this.postatus= this.route.snapshot.paramMap.get('postatus') || '';
   this.suppliername= this.route.snapshot.paramMap.get('suppliername') || ''

   console.log("this.suppliername",this.suppliername);
   console.log("this.UserID",this.UserID);
   console.log("this.postatus",this.postatus);
   console.log("this.PONumber",this.PONumber);
   this.loadParentTableData(this.PONumber );
 }
  // Parent Table Data (PO Data)
 //  parentTableData = [
 //    { 
 //      poNumber: 'PO12345', poDate: '2024-11-01', docType: 'Standard Order', 
 //      items: [
 //        {
 //          itemNo: 1, partCode: 'PC-1001', description: 'Widget A', itemQty: 500, uom: 'pcs', expanded: false,
 //          lotDetails: [
 //            { lotNumber: 'LOT-001', lotQty: 100, etd: '2024-11-20', eta: '2024-11-25', actualDispatch: '2024-11-19', actualArrival: '2024-11-25', attachment: null }
 //          ]
 //        },
 //        {
 //          itemNo: 2, partCode: 'PC-1002', description: 'Widget B', itemQty: 300, uom: 'pcs', expanded: false,
 //          lotDetails: [
 //            { lotNumber: 'LOT-002', lotQty: 150, etd: '2024-11-22', eta: '2024-11-27', actualDispatch: '2024-11-21', actualArrival: '2024-11-27', attachment: null }
 //          ]
 //        }
 //      ]
 //    },
 //    { 
 //      poNumber: 'PO67890', poDate: '2024-11-05', docType: 'Rush Order', 
 //      items: [
 //        {
 //          itemNo: 1, partCode: 'PC-2001', description: 'Widget C', itemQty: 800, uom: 'pcs', expanded: false,
 //          lotDetails: [
 //            { lotNumber: 'LOT-003', lotQty: 400, etd: '2024-11-29', eta: '2024-12-04', actualDispatch: '2024-11-28', actualArrival: '2024-12-04', attachment: null },
 //            { lotNumber: 'LOT-004', lotQty: 400, etd: '2024-11-30', eta: '2024-12-05', actualDispatch: '2024-11-30', actualArrival: '2024-12-05', attachment: null }
 //          ]
 //        },
 //        {
 //          itemNo: 2, partCode: 'PC-2002', description: 'Widget D', itemQty: 600, uom: 'pcs', expanded: false,
 //          lotDetails: [
 //            { lotNumber: 'LOT-005', lotQty: 200, etd: '2024-12-01', eta: '2024-12-06', actualDispatch: '2024-12-01', actualArrival: '2024-12-06', attachment: null }
 //          ]
 //        }
 //      ]
 //    },
 //    { 
 //      poNumber: 'PO24680', poDate: '2024-11-10', docType: 'Bulk Order', 
 //      items: [
 //        {
 //          itemNo: 1, partCode: 'PC-3001', description: 'Gadget A', itemQty: 1200, uom: 'pcs', expanded: false,
 //          lotDetails: [
 //            { lotNumber: 'LOT-006', lotQty: 400, etd: '2024-12-03', eta: '2024-12-08', actualDispatch: '2024-12-02', actualArrival: '2024-12-08', attachment: null },
 //            { lotNumber: 'LOT-007', lotQty: 400, etd: '2024-12-04', eta: '2024-12-09', actualDispatch: '2024-12-04', actualArrival: '2024-12-09', attachment: null },
 //            { lotNumber: 'LOT-008', lotQty: 400, etd: '2024-12-05', eta: '2024-12-10', actualDispatch: '2024-12-05', actualArrival: '2024-12-10', attachment: null }
 //          ]
 //        }
 //      ]
 //    }
 //  ];
 parentTableData: any[] = []; // Initialize as an empty array
  selectedParentRowData: any = null;

  // Toggle parent row
  toggleParentRow(element: any) {
    this.selectedParentRowData = this.selectedParentRowData === element ? null : element;
  }


  showSuccess() {
   debugger;
   // alert("test");
   // this.messageService.add({
   //   severity: 'success',
   //   summary: 'Success',
   //   detail: 'Data saved successfully!'
   // });
 }
  // Add lot to item
 //  addLotToItem(child: any) {
 //   // Extract all existing lot numbers and ensure they are integers
 //   const existingLotNumbers = child.lotDetails
 //     .map((l: any) => parseInt(l.lotnumber, 10)) // Ensure numbers are integers
 //     .filter((num: number) => !isNaN(num)); // Exclude invalid numbers
 
 //   // Find the maximum lot number and increment by 1 for the new lot
 //   const nextLotNumber = existingLotNumbers.length > 0 ? Math.max(...existingLotNumbers) + 1 : 1;
 
 //   // Define the new lot with the next unique lot number
 //   const newLot = {
 //     lotnumber: nextLotNumber,
 //     lotqty: 0,
 //     etd: '2024-12-15',
 //     eta: '2024-12-20',
 //     actualdispatch: '',
 //     actualarrival: '',
 //     attachment: null
 //   };
 
 //   // Add the new lot to the lotDetails array
 //   child.lotDetails.push(newLot);
 
 //   // Optionally expand the row to show the new lot
 //   child.expanded = true;
 
 //   // Log for debugging purposes
 //   console.log('Added new lot:', newLot);
 //   console.log('Updated lot details:', child.lotDetails);
 // }
 // addLotToItem(child: any) {
 //   // Calculate the total quantity already allocated to lots
 //   const totalAllocatedQty = child.lotDetails.reduce((sum: number, lot: any) => sum + lot.lotqty, 0);
 
 //   // The remaining quantity that can be allocated
 //   const remainingQty = child.itemqty - totalAllocatedQty;
 
 //   if (remainingQty <= 0) {
 //     // If no remaining quantity, do not allow adding more lots
 //     alert('Cannot add more lots. Total quantity exceeds item quantity.');
 //     return;
 //   }
 
 //   // Define the quantity for the new lot
 //   const newLotQty = Math.min(remainingQty, 100); // Add 100 or the remaining quantity, whichever is smaller
 
 //   // Extract all existing lot numbers and ensure they are integers
 //   const existingLotNumbers = child.lotDetails
 //     .map((l: any) => parseInt(l.lotnumber, 10)) // Ensure numbers are integers
 //     .filter((num: number) => !isNaN(num)); // Exclude invalid numbers
 
 //   // Find the maximum lot number and increment by 1 for the new lot
 //   const nextLotNumber = existingLotNumbers.length > 0 ? Math.max(...existingLotNumbers) + 1 : 1;
 
 //   // Define the new lot with the next unique lot number
 //   const newLot = {
 //     lotnumber: nextLotNumber,
 //     lotqty: newLotQty,
 //     etd: '2024-12-15',
 //     eta: '2024-12-20',
 //     actualdispatch: '',
 //     actualarrival: '',
 //     attachment: null
 //   };
 
 //   // Add the new lot to the lotDetails array
 //   child.lotDetails.push(newLot);
 
 //   // Optionally expand the row to show the new lot
 //   child.expanded = true;
 
 //   // Log for debugging purposes
 //   console.log('Added new lot:', newLot);
 //   console.log('Updated lot details:', child.lotDetails);
 // }
 addLotToItem(child: any) {
   const totalAllocatedQty = child.lotDetails.reduce((sum: number, l: any) => sum + l.lotqty, 0);
   const remainingQty = child.itemqty - totalAllocatedQty;
   console.log("totalAllocatedQty",totalAllocatedQty);
   console.log("child.itemqty",child.itemqty);
   if (totalAllocatedQty >= child.itemqty) {
   this.toastr.warning(`The total quantity (${totalAllocatedQty}) exceeds the maximum allowed quantity of ${child.itemqty}. Please adjust the lot quantity.`,'warning');
   return;
 }

 
   const existingLotNumbers = child.lotDetails
     .map((l: any) => parseInt(l.lotnumber, 10))
     .filter((num: number) => !isNaN(num));
   const nextLotNumber = existingLotNumbers.length > 0 ? Math.max(...existingLotNumbers) + 1 : 1;
 
   const newLot = {
     lotnumber: nextLotNumber,
     lotqty: Math.min(remainingQty, remainingQty),
     etd: '',
     eta: '',
     actualdispatch: '',
     actualarrival: '',
     attachment: null,
     isEditing: true,
     isNew: true, // Mark as a new lot
   };
 
   child.lotDetails.push(newLot);
   child.expanded = true;
   
 }
 

 
  // Edit lot
 //  editLot(lot: any) {
 //   // Sample edit operation - this could be replaced with a form or dialog in a real app
 //   lot.lotQty = prompt("Enter new lot quantity:", lot.lotQty) || lot.lotQty;
 //   lot.etd = prompt("Enter new ETD (YYYY-MM-DD):", lot.etd) || lot.etd;
 //   lot.eta = prompt("Enter new ETA (YYYY-MM-DD):", lot.eta) || lot.eta;
 //   lot.actualDispatch = prompt("Enter new actual dispatch date (YYYY-MM-DD):", lot.actualDispatch) || lot.actualDispatch;
 //   lot.actualArrival = prompt("Enter new actual arrival date (YYYY-MM-DD):", lot.actualArrival) || lot.actualArrival;
 // }
 

  // Close lot
  closeLot(lot: any) {
    console.log('Closing lot', lot);
  }

  loadParentTableData(POnumber: number): void {

   this.poService.getParentTableData(POnumber).subscribe({
     next: (data) => {
       this.parentTableData = data.map((order: any) => ({
         ...order,
         items: order.items.map((item: any) => ({
           ...item,
           expanded: false // Ensure expanded is false if not provided
         }))
       }));
       console.log(this.parentTableData);
     },
     error: (err) => {
       console.error('Error fetching data:', err);
     }
   });
   
 }

 // copyLot(lot: any, child: any) {
 //   // Create a shallow copy of the lot object
 //   const copiedLot = { ...lot };
 
 //   // Ensure the copied lot is not in edit mode
 //   copiedLot.isEditing = false;
 
 //   // Extract all valid lot numbers from lotDetails
 //   const existingLotNumbers = child.lotDetails
 //     .map((l: any) => l.lotnumber) // Directly get the `lotnumber`
 //     .filter((num: number) => !isNaN(num) && num > 0); // Ensure valid positive numbers
 
 //   // Calculate the next unique lot number
 //   const nextLotNumber = existingLotNumbers.length > 0
 //     ? Math.max(...existingLotNumbers) + 1
 //     : 1;
 
 //   // Assign the new unique lot number to the copied lot
 //   copiedLot.lotnumber = nextLotNumber;
 //   copiedLot.lotqty=0;
 //   // Add the copied lot to the lotDetails array
 //   child.lotDetails.push(copiedLot);
 
 //   // Expand the row to show the new lot
 //   child.expanded = true;
 
 //   // Log the updated details for debugging
 //   console.log('Existing Lot Numbers:', existingLotNumbers);
 //   console.log('Next Lot Number:', nextLotNumber);
 //   console.log('Updated Lot Details:', child.lotDetails);
 // }
 
 // copyLot(lot: any, child: any) {
 //   // Calculate the total quantity already allocated to lots
 //   const totalAllocatedQty = child.lotDetails.reduce((sum: number, l: any) => sum + l.lotqty, 0);
 
 //   // The remaining quantity that can be allocated
 //   const remainingQty = child.itemqty - totalAllocatedQty;
 
 //   if (remainingQty <= 0) {
 //     // If no remaining quantity, do not allow copying the lot
 //     alert('Cannot copy lot. Total quantity exceeds item quantity.');
 //     return;
 //   }
 
 //   // Extract all existing lot numbers and ensure they are integers
 //   const existingLotNumbers = child.lotDetails
 //     .map((l: any) => parseInt(l.lotnumber, 10)) // Ensure numbers are integers
 //     .filter((num: number) => !isNaN(num)); // Exclude invalid numbers
 
 //   // Find the maximum lot number and increment by 1 for the new lot
 //   const nextLotNumber = existingLotNumbers.length > 0 ? Math.max(...existingLotNumbers) + 1 : 1;
 
 //   // Create a shallow copy of the lot object
 //   const copiedLot = { ...lot };
 
 //   // Assign the new unique lot number
 //   copiedLot.lotnumber = nextLotNumber;
 
 //   // Adjust the copied lot's quantity if it exceeds the remaining quantity
 //   copiedLot.lotqty = Math.min(copiedLot.lotqty, remainingQty);
 
 //   // Ensure the copied lot is not in edit mode
 //   copiedLot.isEditing = false;
 
 //   // Add the copied lot to the lotDetails array
 //   child.lotDetails.push(copiedLot);
 
 //   // Expand the row to show the new lot
 //   child.expanded = true;
 
 //   console.log('Copied new lot:', copiedLot);
 //   console.log('Updated lot details:', child.lotDetails);
 // }
 copyLot(lot: any, child: any) {
   const totalAllocatedQty = child.lotDetails.reduce((sum: number, l: any) => sum + l.lotqty, 0);
   const remainingQty = child.itemqty - totalAllocatedQty;
   console.log("totalAllocatedQty",totalAllocatedQty);

   if (totalAllocatedQty >= child.itemqty) {
     this.toastr.warning(`The total quantity (${totalAllocatedQty}) exceeds the maximum allowed quantity of ${child.itemqty}. Please adjust the lot quantity.`,'warning');
   return;
 }

 
   const existingLotNumbers = child.lotDetails
     .map((l: any) => parseInt(l.lotnumber, 10))
     .filter((num: number) => !isNaN(num));
   const nextLotNumber = existingLotNumbers.length > 0 ? Math.max(...existingLotNumbers) + 1 : 1;
 
   const copiedLot = { ...lot, lotnumber: nextLotNumber };
   copiedLot.lotqty = Math.min(copiedLot.lotqty, remainingQty);
   copiedLot.isEditing = true;
   copiedLot.isNew = true; // Mark as a new lot
 
   child.lotDetails.push(copiedLot);
   child.expanded = true;
 }
   
 
  // Upload attachment
  uploadAttachment(event: any, lot: any, child: any) {
    console.log("Test child",child);
    console.log("Test lot",lot);

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      windowClass: 'modal-class',
    };
    const modalRef = this.modalService.open(
      DocuploadComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.ItemNo= child.itemno;
    modalRef.componentInstance.LotNumber= lot.lotnumber;
    modalRef.componentInstance.PoNumber = this.PONumber;
    modalRef.componentInstance.postatus = this.postatus;
    modalRef.componentInstance.suppliername = this.suppliername;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {

      if (x != undefined || x != '') {
        
        this.toastr.success("success", x);
        
      }
      // this.ReloadOrderDetails()
    });
    //this.PONumber
     const file = event.target.files[0];
     if (file) {
       lot.attachment = file.name;
       console.log('Uploading file for lot', lot, file);
     }
   }


   goback(){
    window.history.back();
   }
  toggleChildRow(child: any) {
   child.expanded = !child.expanded;
 }


 lot = {
   isActive: false,  // Initially inactive
   // Other properties here...
 };

 // Example of toggle function that updates the icon state
 toggleActive(lot: any, action: string) {
   if (action === 'edit') {
     lot.isActiveEdit = !lot.isActiveEdit; // Toggle the 'edit' icon active state
     
   } else if (action === 'close') {
     lot.isActiveClose = !lot.isActiveClose; // Toggle the 'close' icon active state
     // this.deletelot(lot);
     console.log("delete called");
   } else if (action === 'copy') {
     lot.isActiveCopy = !lot.isActiveCopy; // Toggle the 'copy' icon active state
   }
 }
 hoverColor: string = '#007bff'; // Default color for the icon

 editLot(lot: any) {
   lot.isEditing = true;
   // Backup original values when edit starts
   lot.originalLotData = { ...lot };
 }
 
 // saveLot(lot: any) {
 //   lot.isEditing = false;
 //   // If changes are made, save them directly (nothing additional needed if ngModel is used)
 // }
 
 saveLot(lot: any, child: any) {
   // Check total allocated quantity to avoid exceeding the maximum allowed quantity
   const totalAllocatedQty = child.lotDetails.reduce((sum: number, l: any) => sum + l.lotqty, 0);
   const remainingQty = child.itemqty - totalAllocatedQty;
   console.log("totalAllocatedQty", totalAllocatedQty);
 
   if (totalAllocatedQty > child.itemqty) {
     this.toastr.warning(`The total quantity (${totalAllocatedQty}) exceeds the maximum allowed quantity of ${child.itemqty}. Please adjust the lot quantity.`,'warning');
     return;
   }
 
   // Validate required fields
   if (lot.lotqty === "" || lot.actualarrival === "" || lot.actualdispatch === "" || lot.eta === "" || lot.etd === "") {
     this.toastr.warning("Please fill all required fields.");
     return;
   }
 
   // Prepare the data for API in an array format as per the requirement
   const LotData = [{
     "poNumber": `${this.PONumber}`,
     "itemno": child.itemno,
     "userId": `${this.UserID}`,  //add dynamic username later
     "lotnumber": lot.lotnumber,
     "lotqty": lot.lotqty,
     "etd": moment(lot.etd).format('YYYY-MM-DD').toString(),
     "eta": moment(lot.eta).format('YYYY-MM-DD').toString(),
     "actualdispatch": moment(lot.actualdispatch).format('YYYY-MM-DD').toString(),
     "actualarrival": moment(lot.actualarrival).format('YYYY-MM-DD').toString(),
     "attachment": "string",
     "isEditing": false,
     "isNew": false
   }];
 
   console.log("LotData",LotData);
   // Now send the data to the API
   this.poService.updateLot(LotData).subscribe(
     {
       next: (response:any) => {
         console.log('Lot successfully saved:', response);
         // Optionally, you can update the local child data to reflect the saved lot
         this.toastr.success("Lot Added Successfully",'success');
         // debugger;
         // this.showSuccess();
         lot.isEditing = false;  // Disable editing mode after save
         lot.isNew = false;  // Mark the lot as saved
       },
       error: (error:any) => {
         console.error('Error saving lot:', error);
         this.toastr.error('Failed to save the lot. Please try again.','faiure');
       },
       complete: () => {
         console.log('API call complete.');
         // this.loadParentTableData();
       }
     }
   );
 
   console.log('Lot saved:', lot);
 }
 

 // cancelEdit(lot: any) {
   
 //   // Revert to the original data if cancel is clicked
 //   Object.assign(lot, lot.originalLotData);
 //   lot.isEditing = false;
 // }
 saveNewLot(lot: any, child: any) {
   // Send the new lot data to the backend

   const totalAllocatedQty = child.lotDetails.reduce((sum: number, l: any) => sum + l.lotqty, 0);
   const remainingQty = child.itemqty - totalAllocatedQty;
   console.log("totalAllocatedQty",totalAllocatedQty);

   if (totalAllocatedQty >= child.itemqty) {
     this.toastr.warning(`The total quantity (${totalAllocatedQty}) exceeds the maximum allowed quantity of ${child.itemqty}. Please adjust the lot quantity.`);
   return;
 }

   lot.isNew = false;
   // this.poService.saveLotToDatabase(lot).subscribe(
   //   (response) => {
   //     // On successful save:
   //     lot.isNew = false; // Mark as no longer new
   //     console.log('New lot saved successfully:', response);
   //   },
   //   (error) => {
   //     console.error('Error saving new lot:', error);
   //   }
   // );
 }
 
 
 cancelEdit(lot: any, child:any) {
   if (lot.isNew) {
     // If the lot is new and editing is canceled, remove it
     this.toastr.warning('Cancelling new lot. Lot will be removed.','warning');
     const lotIndex = child.lotDetails.findIndex((l: any) => l === lot);
   if (lotIndex !== -1) {
     child.lotDetails.splice(lotIndex, 1); // Remove the lot from the array
   }

     return;
   }
   // Otherwise, revert changes
   Object.assign(lot, lot.originalLotData);
   lot.isEditing = false;
   lot.isNew = false; // Mark as saved
  
 }
 
 deleteLot(child: any, index: number, lot:any) {
   // this.toastr.success('User deleted successfully!', 'Success');
   
   console.log("this.PONumber",this.PONumber);
   console.log("child.itemno",child.itemno);
   console.log("lot.lotnumber",lot.lotnumber);
   
   Swal.fire({
     title: 'Are you sure?',
     // text: `You are about to delete lot ${lot.lotnumber} with quantity ${lot.lotqty}. This action cannot be undone.`,
     // icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Yes, delete it!',
     cancelButtonText: 'No, cancel!',
     reverseButtons: true,
     confirmButtonColor: "#d33",
     width: '400px',  // Set the width of the modal
     padding: '20px',  // Adjust padding to make the modal smaller
   }).then((result:any) => {
     if (result.isConfirmed) {
       this.poService.DeleteLotDetails(this.PONumber, child.itemno, lot.lotnumber).subscribe(
         {
           next: (response:any) => {
             if(response==0){
             console.log('Lot Deleted successfully:', response);
             child.lotDetails.splice(index, 1); // Remove lot from child array
             // Optionally, you can update the local child data to reflect the saved lot
             this.toastr.success("Lot Delted Successfully");
             lot.isEditing = false;  // Disable editing mode after save
             lot.isNew = false;  // Mark the lot as saved
             }
             else
             {
               this.toastr.error("failed to delete");
             }
           },
           error: (error:any) => {
             console.error('Error deleting lot:', error);
             this.toastr.error('Failed to delete the lot. Please try again.');
           },
           complete: () => {
             console.log('API call complete.');
             // this.loadParentTableData();
           }
         }
       );
     } else {
       // Handle cancellation (optional)
       // Swal.fire('Cancelled', 'The lot was not deleted.', 'info');
     }
   });
 }

}
