import { Component, OnInit } from '@angular/core';
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
  styleUrl: './role-master.component.css'
})
export class RoleMasterComponent implements OnInit {

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
  //roleUnitMaster: RoleUnitMaster[] = [];
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
  // shareIndividualCheckedList :{}={}
  // shareCheckedList :any[]=[]
  IsActive: boolean = false;
  Active = "Active";
  items: any = {};
  UserId:any;
  // MenuSpecific: TreeviewItem[] = [];
  // DummyMenuSpecific: TreeviewItem[] = [];





  // config = TreeviewConfig.create({
  //   hasAllCheckBox: false,
  //   hasFilter: false,
  //   hasCollapseExpand: false,
  //   decoupleChildFromParent: false
  // });
  ngOnInit(): void {

    debugger;

    // this.getmenus();

    if (localStorage.getItem("userName") == null) {
      // this.router.navigate(['/welcome']);
      //return;
    }
    this.UserId= 1; //localStorage.getItem("userId");
    


    // const dropdownButton = document.getElementById('multiSelectDropdown');
    // const dropdownMenu = document.querySelector('.dropdown-menu');

    this.rollMasterForm = new FormGroup({
      textsearch: new FormControl(),

    });

    this.getRoleData();
    //console.log('menu list', this.getMenuList())

    const chBoxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
    const dpBtn = document.getElementById('multiSelectDropdown');

    // let mySelectedListItems = [];

  }

  // onCheckboxChange(item: any): void {
  //   if (item.checked) {
  //     // Add the selected item to the selectedItems array
  //     this.selectedItems.push(item);
  //     //console.log(this.selectedItems)
  //   } else {
  //     // Remove the item from the selectedItems array
  //     this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.id !== item.id);

  //   }

  // }
  IsCheckedBox() {

    //console.log(this.IsActive)
    if (this.IsActive) {
      this.Active = "Active";
    }
    else {
      this.Active = "Deactive";
    }

  }
  async openModal() {

    this.getmenus();
    this.display = "block";
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
      // console.log('edit array', this.menu, this.getRole[this.editRowIndex].MenuId)

    } else {
      this.IsActive = true;
      this.Active = "Active";

      this.isEditing = false;
      //  this.getMenuList();
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


  // async getMenuList() {
  //   const data = await this.service.getMenuList().toPromise();
  //   this.getMenu = data;

  //   this.updatelist = this.getMenu.map((d: any) => ({ ...d, checked: false }));
  //   //console.log('menu', this.updatelist)
  // }

  getRoleData() {
    debugger;
    this.service.getRoleDetails().subscribe((_result: any) => {
      this.getRole = _result;
      console.log('ssssss', this.getRole)
    })
  }

  // deleteRow(rowIndex: any) {

  //   if (confirm("Are you sure you want to delete Role?")) {

  //     this.dataArr = {
  //       RoleId: rowIndex,
  //       ModifiedBy: Number(localStorage.getItem("userId"))
  //     };
  //     this.service.deleteRole(this.dataArr).subscribe({
  //       next: (_res) => {

  //         this.toastr.success("Data Deleted Successfully.");
  //         this.getRoleData();
  //       },
  //       error: (error) => {
  //         console.error('API call error:', error);
  //       },
  //     });
  //   }
  // }

  onCloseHandled() {
    this.display = "none";
    this.editModal = false;

  }
  onroleSelected(event: any) {
    this.roleName = event.target.value;
  }

  onItemChange(item: any): void {
    // this.menu = event.target.value;

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

  async editModalMethod(rowIndex: any, item: any) {
    //const data = await this.service.getMenuList().toPromise();
    //this.updatelist = data;
    debugger;

    this.menuList = [];
    this.editRowIndex = [];
    this.editModal = true;
    this.editRowIndex = item;
    //change
    
    this.openModal();

    // this.getRole

    // const data = await this.service.getMenu(3).toPromise()
    // // console.log('data', data);
    // this.MenuSpecific = data;

    // this.MenuSpecific = data.map((value: { text: any; value: any; children: any, checked:boolean; }) => {
    //   return new TreeviewItem({ text: value.text, value: value.value, children: value.children,checked:false });
    // });

    
    console.log(this.getRole);
    console.log(this.MenuSpecific);
    console.log(item);

    setTimeout(() => {
      for (let i = 0; i < item.menuId.split(',').length; i++) {
        for (let j = 0; j < this.MenuSpecific.length; j++) {
          // console.log('his.MenuSpecific[j].children.length : ', this.MenuSpecific[j].children.length);
          // console.log('item.MenuId.split(', ')[i] : ', item.MenuId.split(',')[i]);
          // console.log('MenuSpecific[j].value : ', this.MenuSpecific[j].value);
          if (item.menuId.split(',')[i] == this.MenuSpecific[j].value) {
            this.MenuSpecific[j].checked = true
          }
          for (let k = 0; k < this.MenuSpecific[j].children.length; k++) {
            // console.log("this.MenuSpecific[j].children[k].value : ", this.MenuSpecific[j].children[k].value);
            if (item.menuId.split(',')[i] == this.MenuSpecific[j].children[k].value) {
              this.MenuSpecific[j].children[k].checked = true
            }
          }

        }
      }
      //console.log('my menu checked ', this.MenuSpecific);
    }, 300);

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
          (        // this.service.updateRoleDetails(this.roleData).subscribe(
          response: any) => {
            console.log('Record updated successfully:', response);
            this.getRoleData();
            //
            
            this.Toastr.success("Data Updated Successfully.");
            //this.onCloseHandled(); // Close the modal
          },
          (          error: any) => {
            console.error('Error inserting record:', error);

          }
        );

        // console.log('saved role data', this.roleData)
      }
      else {

        // console.log(list)
        this.dataArr = {
          Role_name: this.roleName,
          Description: this.roleDescription,
          MenuId: this.checkedList,
          CreatedBy: this.UserId,
          IsActive:1,
        };



        this.service.addRoleDetails(this.dataArr).subscribe(
          (response:any) => {
            // console.log('Record inserted successfully:', response);
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
    //console.log('checked',e)
    this.checkedList = e;
    //console.log('updated menu specific',this.MenuSpecific)
  }

  Menu_fromDB: any = [];
  async getmenus() {
    debugger;
    try {
      this.MenuSpecific = [];
      // const data = await this.service.getMenu(3).toPromise();

      const data = await this.service.getMenu(3).toPromise()
      this.MenuSpecific = data;
      // this.MenuSpecific = this.Menu_fromDB.map((value: {
      //   text: any; value: any; children: any,
      //   checked: boolean;
      // }) => {
      //   return new TreeviewItem({ text: value.text, value: value.value, children: value.children, checked: value.checked });
      // });

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


  backToPreviousPage() {
    this.location.back();
  }

  getMenuId() {
    debugger;
    this.checkedList = "";

    var ul = document.getElementById("menus") as any;
    var main_class = ul!.getElementsByClassName("mainmenu_class") as any;

    for (var i = 0; i < main_class.length; i++) {
      if (main_class[i].getElementsByTagName('input').length > 1) {
        for (var j = 1; j < main_class[i].getElementsByTagName('input').length; j++) {
          if (main_class[i].getElementsByTagName('input')[j].checked) {
            this.checkedList += main_class[i].getElementsByTagName('input')[j].value + ",";
          }
        }
      }
      else {
        if (main_class[i].getElementsByTagName('input')[0].checked) {
          this.checkedList += main_class[i].getElementsByTagName('input')[0].value + ",";
        }
      }
    }

    console.log(this.checkedList);
  }

  SelectAllManus(menuid: any, evt: any) {
    debugger;

    if (menuid.items.length > 0) {
      let checkbox = document.getElementById(evt.target.id) as any;
      if (checkbox.checked) {

        for (let i = 0; i < this.MenuSpecific.length; i++) {
          for (let j = 0; j < this.MenuSpecific[i].items.length; j++) {
            for (var k = 0; k < menuid.items.length; k++) {
              if (this.MenuSpecific[i].value == menuid.value) {
                this.MenuSpecific[i].items[j].checked = true
              }
            }
          }
        }
      }
      else {
        for (let i = 0; i < this.MenuSpecific.length; i++) {
          for (let j = 0; j < this.MenuSpecific[i].items.length; j++) {
            for (var k = 0; k < menuid.items.length; k++) {
              if (this.MenuSpecific[i].value == menuid.value) {
                this.MenuSpecific[i].items[j].checked = false
              }
            }
          }
        }
      }
    }

    setTimeout(() => {
      this.getMenuId();
    }, 200);


  }

}


