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
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  
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

  ngOnInit(): void {
    this.fetchdocdetails();
    // this.formatDates();
    //this.filteredData = [...this.doc_deatils];
  }



  fetchdocdetails() {
    debugger;
    this.service.getdocdetails().subscribe(
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
      this.modalService.dismissAll();
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
            this.fetchdocdetails();
            this.resetForm();
            this.saveTrigger.emit("Success");
          },
          error: (error) => {
            console.error('File upload failed:', error);
            alert('File upload failed!');
            this.saveTrigger.emit("Unable To Upload File");
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
    this.saveTrigger.emit("Success");
    this.modalService.dismissAll();
    console.log('Closing the upload section...');
  }


  goBack(): void {
    window.history.back();
  }


}
