import { AdminService } from './../Services/admin.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
//import { navbarData } from './nav-data';
import { SublevelMenuComponent } from "./sublevel-menu.component";
import { CommonModule } from '@angular/common';
//import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
 
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, SublevelMenuComponent,CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1500ms', 
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(180deg)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  //navData = navbarData;
  navData :any ;

  multiple: boolean = false;
  pageHeader: any = "Page Header";
  username :any;

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  constructor(public router: Router, private adminService : AdminService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem("username");
    
    this.GetMenu();
      this.screenWidth = window.innerWidth;
  }

  async GetMenu(){
    this.navData = [];
    // const roleid=localStorage.getItem("roleId");
    const roleid=localStorage.getItem("roleId");
    const userdata = await this.adminService.getMenu(roleid).toPromise();
    this.navData = userdata;

  }

  toggleShow(data:any): void {
    this.collapsed = true;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    this.handleClick_show(data);
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  toggleCollapse_close(){
    this.collapsed =false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  handleClick(item: any): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded
  }
  
  handleClick_show(item: any): void {
    this.shrinkItems(item);
    item.expanded = true;
  }

  // handleClick_hide(item: any): void {
  //   this.shrinkItems(item);
  //   item.expanded = false;
  // }

  getActiveClass(data: any): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: any): void {
    if (!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  
}