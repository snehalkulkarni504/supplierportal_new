import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from "../../../SearchPipe/search.pipe";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
 

@Component({
  selector: 'app-usermaster',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbPaginationModule, SearchPipe, NgSelectModule,NgxPaginationModule],
  templateUrl: './usermaster.component.html',
  styleUrl: './usermaster.component.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class UsermasterComponent {
  constructor(public service: AdminService,private toastr: ToastrService) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  //public toaster!: ToastrService;
  isSubmitted: boolean = false;
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  UserMasterForm!: FormGroup;
  AddUserMasterForm!: FormGroup;

  UserId:any;
  user:any;
  userName: any;
  fullName: any;
  emailId: any;
  roleId: any;
  supplierId: any;
  MST_Role_Id: any;
  IsActive: boolean = false;
  Active = "Active";
  display = "none";

  roleOptions: any = [];
  supplierOptions: any=[];
  filteredRoles: any // = this.roles;
  userlist:any
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 2;

  roleToEdit: any = null;
  isEditing: boolean = false;
  edituserindex: number | null = null;
  selectedRole: any = null;
  header: string = 'Role Details';
  dropdownOpen: boolean = false;
  txt_btn: string = 'Save';
  isAddRolePopupVisible: boolean = false;

  ngOnInit() {
    this.user  = localStorage.getItem("mst_user_id");

    this.UserMasterForm = new FormGroup({
      textsearch: new FormControl(),
    });
    this.AddUserMasterForm = new FormGroup({
      userName: new FormControl(),
      fullName: new FormControl(),
      emailId: new FormControl(),
      roleId: new FormControl(),
      IsActive: new FormControl(),
      supplierId:new FormControl(),
      
    });

    this.getuserdetailsinfo();
    this.getrolesdetails();
    this.getSupplierdata();
  }
  async getrolesdetails() {
    debugger;
    this.roleOptions= [];
    const userdata = await this.service.getroles().toPromise();
    this.roleOptions = userdata;
  }

  async getSupplierdata() {
    debugger;
    this.supplierOptions= [];
    const SupllierData = await this.service.getSupplier().toPromise();
    this.supplierOptions = SupllierData;
  }


  async getuserdetailsinfo() {
    debugger;
    const userdata = await this.service.getuserdetails().toPromise();
    this.filteredRoles = userdata;
    this.userlist=userdata;


  }
  adduserdetailsinfo(data: any) {
    this.service.adduserdetails(data).subscribe({
      next: (response: any) => {
        console.log('User added successfully', response);
        this.toastr.success('User added successfully!');
        this.getuserdetailsinfo();
      },
      error: (err: any) => {
        console.error('Error updating user role', err);
      },
      complete: () => {
        console.log('Update user role request completed');

      }
    });
  }

  updateuserdetailsinfo(data: any) {
    debugger;

    this.service.updateuserdetails(data).subscribe({
      next: (response: any) => {
        console.log('User role updated successfully', response);
        this.toastr.success('User updated successfully!');
        this.getuserdetailsinfo();
      },
      error: (err: any) => {
        console.error('Error updating user role', err);
      },
      complete: () => {
        console.log('Update user role request completed');


      }
      
    });

  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goBack(): void {
    window.history.back();
  }

   // Method to open the delete confirmation popup
  openDeleteConfirmation(id: number): void {
    
debugger;
    // if (confirm("Are you sure you want to mark this role as Inactive?")) {
    //   if (id !== null) {
    //     this.deleteuser(id);
    //   }

    //   this.getuserdetailsinfo();

    // }
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to mark this role as Inactive?`,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Inactive it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
      confirmButtonColor: "#d33",
      width: '400px',  // Set the width of the modal
      padding: '20px',  // Adjust padding to make the modal smaller
    }).then((result:any) => {
      if (result.isConfirmed) {
        if (id !== null) {
          this.deleteuser(id);
        }
  
        this.getuserdetailsinfo();
      } else {
        // Handle cancellation (optional)
        // Swal.fire('Cancelled', 'The lot was not deleted.', 'info');
      }
    });

  }

  deleteuser(userId: any): void {
    this.service.Inactiveuser(userId).subscribe(
      (response:any) => {
        console.log('User successfully deactivated:', response);
        this.getuserdetailsinfo();
        this.toastr.success('User deleted successfully!');
      },
      (error:any) => {
        console.error('Error deactivating user:', error);
      }
    );
  }

  isValidEmail(emailId: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailId);
  }


  isDuplicate(username: string): boolean {
    const lowerCaseUsername = username.trim().toLowerCase();

    const duplicate = this.userlist.some(
      (user: any) => user?.userName?.trim()?.toLowerCase() === lowerCaseUsername
    );

    return duplicate;
  }
  isDuplicateEmail(emaildId: string): boolean {
    // const lowerCaseemail = emaildId.trim().toLowerCase();

    const duplicate = this.userlist.some(
      (user: any) => user?.emaildId?.trim()?.toLowerCase() === emaildId.trim().toLowerCase()
    );

    return duplicate;
  }
  

  
  toggleAddRolePopup(role?: any) {
    debugger;
    if (role && role.id !== undefined) {
      debugger;
      
      this.roleToEdit = role;
      this.edituserindex = role.id;
      this.isEditing = true;

      this.userName = role.userName;
      this.fullName = role.fullname;
      this.emailId = role.emailId;
      this.roleId = role.msT_Role_Id;
      this.IsActive = role.status;
      this.supplierId= role.supplierId;

      if(role.status == "Active"){
        this.IsActive = true
      }
      else{
        this.IsActive = false
      }
      
    }
    else {
      this.isSubmitted = false;
      this.userName = "";
      this.fullName = "";
      this.emailId = "";
      this.roleId = "";
      this.supplierId ="";
      this.IsActive = true;

      this.isEditing = false;
      this.edituserindex = null;
      this.Active = "Active";
    }

    this.display = "block";
  }

  saveRole() {
    debugger;
    this.isSubmitted = true;

    // if (!this.userName || !this.fullName || !this.emailId || !this.roleId) {
    //   this.toastr.warning("Please fill all required fields.");
    //   return;
    // }
    if (!this.userName) {
      this.toastr.warning("Please Enter User Name.");
      return;
      
    }
    this.isSubmitted = true;
    if (!this.fullName) {
      this.toastr.warning("Please enter Full Name.");
      return;
    }

    if (!this.isValidEmail(this.emailId)) {
      this.toastr.warning('Please enter Valid Email.');
      return;
    }
    if (!this.roleId) {
      this.toastr.warning("Please select Role.");
      return;
    }
  

    if (this.isEditing && this.edituserindex != null) {
      // Prepare data for updating
      const updateData = {
        UserId: this.edituserindex,

        userName: this.userName,
        roleId: this.roleId,
        isActive: this.IsActive,
        fullName: this.fullName,
        emailId: this.emailId,
        ModifiedBy: this.user,
        supplierId:this.supplierId

      };

      this.updateuserdetailsinfo(updateData);
      console.log('Updated role:', updateData);
    } else {
      // Prepare data for adding
      const newRoleData = {
        userName: this.userName,
        roleId: this.roleId,
        isActive: this.IsActive,
        fullName: this.fullName,
        emailId: this.emailId,
        createdBy: this.user,
        supplierId:this.supplierId
      };
      if (this.isDuplicate(this.userName)) {
        this.toastr.warning('Username already exists.');
        return;
      }
      if (this.isDuplicateEmail(this.emailId)) {
        this.toastr.warning('Email already exists.');
        return;
      }


      this.adduserdetailsinfo(newRoleData);
      console.log('Added new role:', newRoleData);
    }
    this.getuserdetailsinfo(); 
    this.onCloseHandled();

  }


  IsCheckedBox() {

    console.log(this.IsActive)
    if (this.IsActive) {
      this.Active = "Active";
    }
    else {
      this.Active = "Inactive";
    }
  }

  onCloseHandled(){
    this.display = "none";
  }


}
