import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from '../../Services/supplier.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-docupload',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule,NgbModule],
  templateUrl: './docupload.component.html',
  styleUrl: './docupload.component.css'
})
export class DocuploadComponent {

  constructor(public service: SupplierService, public cdr: ChangeDetectorRef, private modalService: NgbModal) { }

  @Input() ItemNo:any;
  @Input() PoNumber: any;
  @Input() LotNumber:any;
  @Input() postatus:any;
  @Input() suppliername:any;
  @Input() page:any;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  @Output() errorOccurred: EventEmitter<string> = new EventEmitter();

  

  
  doc_deatils = [
    { select: false, documentNo: 1, documentType: 'Test1', revision: 1, fileName: 'M001', poNumber: 101, itemNo: 1, lotNumber: 1, uploadDate: '2024-11-2025', updatedBy: 'Eswar', remarks: 'This is Demo' },
    { select: false, documentNo: 1, documentType: 'Test2', revision: 1, fileName: 'M001', poNumber: 101, itemNo: 1, lotNumber: 1, uploadDate: '2024-11-2025', updatedBy: 'Eswar', remarks: 'This is Demo' },
    { select: false, documentNo: 1, documentType: 'Test3', revision: 1, fileName: 'M001', poNumber: 101, itemNo: 1, lotNumber: 1, uploadDate: '2024-11-2025', updatedBy: 'Eswar', remarks: 'This is Demo' },
    { select: false, documentNo: 1, documentType: 'Test4', revision: 1, fileName: 'M001', poNumber: 101, itemNo: 1, lotNumber: 1, uploadDate: '2024-11-2025', updatedBy: 'Eswar', remarks: 'This is Demo' },

  ];

  doc_det: any;

  filteredData: any[] = [];

  searchQuery: string = '';
  textsearch: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 3;

  documentNo: string = '';
  documenttype: string = '';
  remarks: string = '';
  selectedFile: File | null = null;
  disable:boolean=false;
  roleid:any;
  tpsolaruser:boolean=false;
  storeduser:any;
  hideuploadsec:boolean=false;
  documentTypes: string[] = ['Type1', 'Type2', 'Type3', 'Type4'];
  showValidationError: boolean = false;



  // ngOnInit(): void {
  //   debugger;
  //   if(this.suppliername=="" || this.postatus=="Closed"){
  //     this.disable=true;
  //  }
  //  else
  //  {
  //   this.disable=false;
  //  }

  //  if(this.page=="internal"){
  //   this.disable=true;
  //  }
  //   this.fetchdocdetails(this.PoNumber.toString(),this.ItemNo.toString(),this.LotNumber);
  //   // this.formatDates();
  //   //this.filteredData = [...this.doc_deatils];
  //   this.roleid=Number(localStorage.getItem("roleId"));
  //   if(this.roleid==6)
  //   {
  //     this.tpsolaruser=true
  //   }
     
  // }

  ngOnInit(): void {
    debugger;
  
    // Check if suppliername is empty or postatus is "Closed"
     this.disable = this.suppliername === "" || this.postatus === "Closed";
  
    // Additional condition for internal pages
    if (this.page === "internal") {
      this.disable = true;
    }
  
    // Fetch roleId from localStorage and parse it as a number
    const storedRoleId = localStorage.getItem("roleId");
    const storeduser = localStorage.getItem("username");
    this.storeduser=storeduser;
    
    if (storedRoleId) {
      this.roleid = Number(storedRoleId);
    } else {
      console.error("roleId not found in localStorage");
      this.roleid = null; // Handle missing roleId gracefully
    }
  
    // Check if the user is a TPSolar user
    this.tpsolaruser = this.roleid === 6;
    // Fetch document details
    if(this.roleid==5)
    {
      this.hideuploadsec=true;
    }

    this.fetchdocdetails(this.PoNumber.toString(), this.ItemNo.toString(), this.LotNumber);
  }
  



  fetchdocdetails(pono:string,itemno:string,lotno:number) {
    debugger;
    this.service.getdocdetails(pono,itemno,lotno).subscribe(
      (data: any[]) => {
        debugger;
        this.doc_deatils = data;
        this.doc_det = data;
        console.log(data);
        this.formatDates();
        this.filteredData = [...this.doc_deatils];
        if(data.length>=4)
        {
          this.hideuploadsec=false;
        }
      },
      (error) => {
        console.log("Fetching error", error)
      }
    );
  }

  // onCheckboxChange(item: any): void {
  //   console.log('Checkbox state changed for:', item);
  //   console.log('Checked:', item.select);
  // }

  selectAllChecked: boolean = false;

  onSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.doc_deatils.forEach((item) => {
      item.select = checked;
    });

    this.filteredData.forEach((item) => {
      item.select = checked;
    });
  }

  onCheckboxChange(): void {
    const allSelected = this.doc_deatils.every(item => item.select);
    this.selectAllChecked = allSelected;
  }
  


  formatDates(): void {
    this.doc_deatils = this.doc_deatils.map(item => {
      return {
        ...item,
        uploadDate: this.formatDate(item.uploadDate)
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

  onSearch(): void {
    const query = this.searchQuery?.trim().toLowerCase();
    if (!query) {
      this.filteredData = [...this.doc_deatils];
      return;
    }

    this.filteredData = this.doc_deatils.filter(item =>
      (item.documentNo?.toString() || '').toLowerCase().includes(query) ||
      (item.documentType?.toLowerCase() || '').includes(query) ||
      (item.fileName?.toLowerCase() || '').includes(query) ||
      (item.updatedBy?.toLowerCase() || '').includes(query) ||
      (item.remarks?.toLowerCase() || '').includes(query)
    );
  }




  get Data() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }



  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile.name);
    }
  }



  // onUpload(): void {
  //   if (this.selectedFile && this.documentNo && this.documenttype) {
  //    // this.modalService.dismissAll();
  //     const updatedby = this.storeduser;

  //     this.service.uploadFile(this.selectedFile,this.documentNo,this.documenttype, this.PoNumber, this.ItemNo, this.LotNumber,this.remarks,updatedby)
  //       .subscribe({
  //         next: (response) => {
  //           console.log('File uploaded successfully:', response);
  //           alert('File uploaded successfully!');

  //           this.fetchdocdetails(this.PoNumber,this.ItemNo,this.LotNumber);
  //           this.resetForm();
  //           this.saveTrigger.emit("Success");
  //         },
  //         error: (error) => {
  //           console.error('File upload failed:', error);
  //           alert('File upload failed!');
  //          // this.saveTrigger.emit("Unable To Upload File");
  //          this.errorOccurred.emit(error.message);
  //         }
  //       });
  //   }

  //   else {
  //     alert('Please attach a file and provide necessary details.');
  //   }
  // }



  onUpload(): void {
    this.showValidationError = false;
  
    // Validate required fields
    if (!this.documenttype) {
      this.showValidationError = true;
      alert('Please fill out all mandatory fields (marked with *).');
      return;
    }
  
    if (this.selectedFile && this.documenttype) {
      const updatedby = this.storeduser;
  
      this.service.uploadFile(
        this.selectedFile,
        this.documentNo,
        this.documenttype,
        this.PoNumber,
        this.ItemNo,
        this.LotNumber,
        this.remarks,
        updatedby
      ).subscribe({
        next: (response) => 
        {
          console.log('File uploaded successfully:', response);
          //alert('File uploaded successfully!');
  
          this.fetchdocdetails(this.PoNumber, this.ItemNo, this.LotNumber);
          this.resetForm();
          this.saveTrigger.emit("file Uploaded Successfully");
        },
        error: (error) => 
        {
          console.error('File upload failed:', error);
          alert('File upload failed!');
          this.errorOccurred.emit(error.message);
        }
      });
    } 
    else 
    {
      alert('Please attach a file and provide necessary details.');
    }
  }
  


  resetForm(): void {
    this.selectedFile = null;
    this.documentNo = '';
    this.documenttype = '';
    this.remarks = '';

    const fileInput: HTMLInputElement = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onDownload(data:any): void {
    debugger;
    // const selectedDocuments = this.doc_deatils.filter((doc) => doc.select);

    // if (selectedDocuments.length === 0) {
    //   alert("Please select at least one document to download.");
    //   return;
    // }

    const fileRequests ={
      poNumber: data.poNumber.toString(),
      itemNumber: data.itemNo.toString(),
      lotNumber: data.lotNumber.toString(),
      fileName: data.fileName,
    };

    this.service.downloadMultipleFiles(fileRequests).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/zip' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Documents.zip';
        link.click();
      },
      (error) => {
        console.error('Download error:', error);
        alert(`Error: ${error.error?.message || "Unable to download files."}`);
      }
    );
  }

  approve(data:any)
  {
    debugger;
    this.service.approveddoc(data.docid).subscribe(
      (response)=> {
        //this.saveTrigger.emit("document Approved");
        this.fetchdocdetails(this.PoNumber.toString(), this.ItemNo.toString(), this.LotNumber);

      },
      (error) => {
        console.error('Error while approve')
        alert(`Error: ${error.error?.message || "Unable to approve files."}`);
      }
    );
  }


  onClose(): void {
    this.modalService.dismissAll();
    console.log('Closing the upload section...');
  }


  goBack(): void {
    window.history.back();
  }
  onSearchEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent; 
    keyboardEvent.preventDefault(); 
    console.log('Enter key pressed:', this.textsearch);
  }

  isModalOpen: boolean = false;
  rejectionRemarks: string = '';
  rejectionid:any;

  // Called when Reject button is clicked outside the modal
  rejectmodal(data:any) {
    this.rejectionRemarks = '';
    this.isModalOpen = true;
    this.rejectionid = data.docid;
  }

  // Close modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Submit rejection with remarks
  submitRejection() {
    if (!this.rejectionRemarks.trim()) {
      alert('Please enter rejection remarks.');
      return;
    }

    this.reject();
    console.log('Rejected with remarks:', this.rejectionRemarks);

    this.closeModal();
  }

  reject()
  {
    debugger;
    this.service.rejectdoc(this.rejectionid,this.rejectionRemarks).subscribe(
      (response)=> {
        this.errorOccurred.emit("document Rejected")
        //this.saveTrigger.emit("document Rejected");
        this.fetchdocdetails(this.PoNumber.toString(), this.ItemNo.toString(), this.LotNumber);

      },
      (error) => {
        console.error('Error while approve')
        alert(`Error: ${error.error?.message || "Unable to reject files."}`);
      }
    );
  }

  //selectedFile: File | null = null;

  onFileSelected(event: Event, data:any): void {
    debugger;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const updateFile = input.files[0];
      console.log('Selected file:', updateFile.name);
      alert('Are sure to reupload the file');

      if (updateFile) {
          const updatedby = this.storeduser;
    
          this.service.uploadFile(
          updateFile,
          this.documentNo=data.documentNo,
          this.documenttype=data.documentType,
          this.PoNumber,
          this.ItemNo,
          this.LotNumber,
          this.remarks,
          updatedby
        ).subscribe({
          next: (response) => 
          {
            console.log('File uploaded successfully:', response);
            //alert('File uploaded successfully!');
    
            this.fetchdocdetails(this.PoNumber, this.ItemNo, this.LotNumber);
            this.resetForm();
            this.saveTrigger.emit("file Uploaded Successfully");
          },
          error: (error) => 
          {
            console.error('File upload failed:', error);
            alert('File upload failed!');
            this.errorOccurred.emit(error.message);
          }
        });
      } 
      else 
      {
        alert('Please attach a file and provide necessary details.');
      }
    }
  }



}
