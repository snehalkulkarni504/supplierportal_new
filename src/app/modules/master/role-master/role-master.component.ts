import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchPipe } from '../../../SearchPipe/search.pipe';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../Services/admin.service';

import { Location } from '@angular/common';
interface MenuItem {
  text: string;
  value: string;
  children?: MenuItem[];
  selected?: boolean;
}

@Component({
  selector: 'app-role-master',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbPaginationModule,NgxPaginationModule,SearchPipe,NgSelectModule],
  templateUrl: './role-master.component.html',
  styleUrl: './role-master.component.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RoleMasterComponent implements OnInit {
isVisible: any;

  constructor(public service: AdminService, private location: Location, private Toastr : ToastrService) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 5
    };
  }

  textsearch: string = '';
  page: number = 1;
  pageSize: number = 5;
  config: any;
  filterMetadata = { count: 0 };
  MenuSpecific: any;
  isEditing: boolean = false;

  rollMasterForm!: FormGroup;
  getMenu: any = {};
  getRole: any = {};

  display = "none";
  header: string = '';
  txt_btn: string = '';
  roleName: any;
  roleDescription: any;
  RoleId: any;
  menu: any = {};
  status: any;
  date: Date = new Date();
  editModal: boolean = false;
  editRowIndex: any = []
  dataArr: any = [];

  showError1: boolean = false;
  showError2: boolean = false;
  showError3: boolean = false;
  dropdownButton: any
  dropdownMenu: any
  list: any[] = []

  selectedItems: any[] = []
  checkedList: any;
  menuList: any[] = []
  currentSelected: {} = {}
  roleData: any = {};
  showDropDown: boolean = false

  IsActive: boolean = false;
  Active = "Active";
  items: any = {};
  UserId:any;
  

  ngOnInit(): void {

    debugger;

    // this.getmenus();

    if (localStorage.getItem("username") == null) {
      // this.router.navigate(['/welcome']);
      //return;
    }
    this.UserId= localStorage.getItem("mst_user_id");
    
    this.rollMasterForm = new FormGroup({
      textsearch: new FormControl(),

    });

    this.getRoleData();
    const chBoxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
    const dpBtn = document.getElementById('multiSelectDropdown');

  }

  IsCheckedBox() {
    if (this.IsActive) {
      this.Active = "Active";
    }
    else {
      this.Active = "Deactive";
    }

  }
  async openModal(): Promise<void> {

    this.display = "block";
    await this.getmenus();
    if (this.editModal) {
      debugger;
      this.txt_btn = 'Update';
      this.isEditing = true;

      this.roleName = this.editRowIndex.roleName;
      this.RoleId = this.editRowIndex.roleId;
      this.roleDescription = this.editRowIndex.description;
      if (this.editRowIndex.isActive == "Active") {
        this.Active = "Active";
        this.IsActive = true;
      }
      else {
        this.Active = "Deactive";
        this.IsActive = false;
      }

    } else {
      debugger;
      this.IsActive = true;
      this.Active = "Active";

      this.isEditing = false;
      this.header = 'Add Role';
      this.txt_btn = 'Save';
      this.roleName = "";
      this.menu = this.getMenu;
      this.roleDescription = "";
      this.status = "";
      this.checkedList = [];
      this.menuList = [];


    }
  };


  getRoleData() {
    debugger;
    this.service.getRoleDetails().subscribe((_result: any) => {
      this.getRole = _result;
      console.log('ssssss', this.getRole)
    })
  }


  onCloseHandled() {
    this.display = "none";
    this.editModal = false;

  }
  onroleSelected(event: any) {
    this.roleName = event.target.value;
  }

  onItemChange(item: any): void {

    if (item.selected) {
      this.checkedList.push(item.text);
    } else {

      const index = this.checkedList.indexOf(item.text)
      if (index !== -1) {
        this.checkedList.splice(index, 1)
      }

    }

  }

  descriOnBlur(event: any) {
    this.roleDescription = event.target.value;
  }
  roleOnBlur(event: any) {
    this.roleName = event?.target.value;
  }
  onSelected(event: any) {
    this.status = event.target.value;
  }

  updatelist: any;

// async editModalMethod2(rowIndex: any, item: any) {
//     debugger;
//     this.menuList = [];
//     this.editRowIndex = [];
//     this.editModal = true;
//     this.editRowIndex = item;
//     this.openModal();
//     console.log(this.getRole);
//     console.log(this.MenuSpecific);
//     console.log(item);

//     setTimeout(() => {
//       for (let i = 0; i < item.menuId.split(',').length; i++) {
//         for (let j = 0; j < this.MenuSpecific.length; j++) {
//           if (item.menuId.split(',')[i] == this.MenuSpecific[j].value) {
//             this.MenuSpecific[j].checked = true
//           }
//           for (let k = 0; k < this.MenuSpecific[j].items.length; k++) {
//             if (item.menuId.split(',')[i] == this.MenuSpecific[j].items[k].value) {
//               this.MenuSpecific[j].items[k].checked = true
//             }
//           }

//         }
//       }
//     }, 300);
//   }

async editModalMethod(rowIndex: any, item: any) {
  this.editRowIndex = item;
  this.editModal = true;

  await this.openModal(); // Make openModal() return a Promise that waits for getmenus()

  const selectedIds = item.menuId?.split(',') ?? [];

  this.MenuSpecific.forEach((menu: { checked: boolean; items: any[]; }) => {
    menu.checked = false;
    menu.items?.forEach((submenu: any) => submenu.checked = false);
  });

  this.MenuSpecific.forEach((menu: { value: { toString: () => any; }; checked: boolean; items: any[]; }) => {
    let hasSubmenu = false;

    if (selectedIds.includes(menu.value.toString())) {
      menu.checked = true;
    }

    menu.items?.forEach((submenu: any) => {
      if (selectedIds.includes(submenu.value.toString())) {
        submenu.checked = true;
        hasSubmenu = true;
      }
    });

    if (hasSubmenu) {
      menu.checked = true;
    }
  });

  this.getMenuId();
}




onSaveButton() {
    debugger;
    if (!this.onClickBlankInputValidation()) {
      if (this.editModal) {
       
        this.roleData = {
          RoleId: this.RoleId,
          RoleName: this.roleName,
          Description: this.roleDescription,
          MenuId: this.checkedList,
          ModifiedBy:this.UserId,
          IsActive:1,
        }
        const data1= this.roleData;
        console.log(this.roleData);
        debugger;
        this.service.updateRoleDetails(data1).subscribe(
          (  
          response: any) => {
            console.log('Record updated successfully:', response);
            this.getRoleData();
            //
            
            this.Toastr.success("Data Updated Successfully.");
          },
          (          error: any) => {
            console.error('Error inserting record:', error);

          }
        );

      }
      else {
        this.dataArr = {
          Role_name: this.roleName,
          Description: this.roleDescription,
          MenuId: this.checkedList,
          CreatedBy: this.UserId,
          IsActive:1,
        };



        this.service.addRoleDetails(this.dataArr).subscribe(
          (response:any) => {
            this.getRoleData();
            this.Toastr.success("Data Inserted Successfully.");
          },
          (error:any) => {
            console.error('Error inserting record:', error);

          }
        );

      }
      this.editModal = false;
      this.display = "none";
    }
  }
  onSelectedChange(e: any) {
    this.checkedList = e;
  }

  Menu_fromDB: any = [];
  async getmenus() {
    debugger;
    try {
      this.MenuSpecific = [];
      const data = await this.service.getMenu(3).toPromise()
      this.MenuSpecific = data;
    }
    catch (err) {
      console.error('Error fetching menus', err);
    }
  }
  onClickBlankInputValidation(): boolean {
    if (this.roleName == '') {
      this.showError1 = true;
      return true;
    }
    else if (this.roleDescription == "") {
      this.showError2 = true;
      return true;
    }
    else {
      return false;
    }
  }


  goBack(): void {
    window.history.back();
  }

  getMenuId() {
    this.checkedList = "";
  
    this.MenuSpecific.forEach((menu: { checked: any; value: string; items: any[]; }) => {
      let addedMenu = false;
  
      if (menu.checked) {
        this.checkedList += menu.value + ",";
        addedMenu = true;
      }
  
      if (menu.items && menu.items.length > 0) {
        menu.items.forEach((submenu: any) => {
          if (submenu.checked) {
            this.checkedList += submenu.value + ",";
  
            if (!addedMenu) {
              this.checkedList += menu.value + ",";
              addedMenu = true;
            }
          }
        });
      }
    });
  
    if (this.checkedList.endsWith(",")) 
    {
      this.checkedList = this.checkedList.slice(0, -1);
    }
  
    console.log("Final checked IDs:", this.checkedList);
  }
  
  
  
  onSubmenuChange(menu: any) {
    const anyChecked = menu.items.some((submenu: any) => submenu.checked);
    menu.checked = anyChecked;
  
    this.getMenuId();
  }  

  

  SelectAllManus(menu: any, evt: any) {
    const isChecked = evt.target.checked;
  
    menu.checked = isChecked;
  
    // Update all submenus
    if (menu.items && menu.items.length > 0) {
      menu.items.forEach((submenu: any) => {
        submenu.checked = isChecked;
      });
    }
  
    this.getMenuId();
  }  
  
  onSearchEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent; 
    keyboardEvent.preventDefault(); 
    console.log('Enter key pressed:', this.textsearch);
  }

}


