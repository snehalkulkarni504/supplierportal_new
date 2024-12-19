import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from '../../Services/supplier.service';


@Component({
  selector: 'app-docupload',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
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
    { select: false, documentNo: 1, documentType: 'PDF', revision: 1, fileName: 'M001', poNumber: 101, itemNo: 1, lotNumber: 1, uploadDate: '2024-11-20', updatedBy: 'Eswar', remarks: 'abcd' },
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
    if (storedRoleId) {
      this.roleid = Number(storedRoleId);
    } else {
      console.error("roleId not found in localStorage");
      this.roleid = null; // Handle missing roleId gracefully
    }
  
    // Check if the user is a TPSolar user
    this.tpsolaruser = this.roleid === 6;
  
    // Fetch document details
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



  onUpload(): void {
    if (this.selectedFile && this.documentNo && this.documenttype) {
      // this.modalService.dismissAll();
      const updatedby = 'Bikash';

      this.service.uploadFile(this.selectedFile,this.documentNo,this.documenttype, this.PoNumber, this.ItemNo, this.LotNumber,this.remarks,updatedby)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
            alert('File uploaded successfully!');

            // const fileDetails = {
            //   filename: this.selectedFile!.name,
            //   documentno: this.documentNo,
            //   documenttype: this.documenttype,
            //   pono: '103',
            //   itemno: '1',
            //   lotno: 5,
            //  // revision: 0,
            //   remarks: this.remarks,
            //   updatedby: 'Snehal'
            // };

            // debugger;
            // this.service.uploadFileDetails(fileDetails).subscribe(
            //   (detailsResponse) => {
            //     console.log('File details saved successfully:', detailsResponse);
            //     this.fetchdocdetails();
            //   },
            //   (error) => {
            //     console.error('Error saving file details:', error);
            //     alert('Failed to save file details. Please try again.');
            //   }
            // );
            this.fetchdocdetails(this.PoNumber,this.ItemNo,this.LotNumber);
            this.resetForm();
            this.saveTrigger.emit("Success");
          },
          error: (error) => {
            console.error('File upload failed:', error);
            alert('File upload failed!');
           // this.saveTrigger.emit("Unable To Upload File");
           this.errorOccurred.emit(error.message);
          }
        });
    }

    else {
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

  onDownload(): void {
    debugger;
    const selectedDocuments = this.doc_deatils.filter((doc) => doc.select);

    if (selectedDocuments.length === 0) {
      alert("Please select at least one document to download.");
      return;
    }

    const fileRequests = selectedDocuments.map((doc) => ({
      poNumber: doc.poNumber.toString(),
      itemNumber: doc.itemNo.toString(),
      lotNumber: doc.lotNumber.toString(),
      fileName: doc.fileName,
    }));

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


}
