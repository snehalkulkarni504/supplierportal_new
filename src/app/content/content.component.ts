import { Component } from '@angular/core';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { BodyComponent } from '../body/body.component';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [SidenavComponent, BodyComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  

}
