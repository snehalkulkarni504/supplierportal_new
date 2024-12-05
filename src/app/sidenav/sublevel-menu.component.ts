import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sublevel-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: ` <ul *ngIf="collapsed && data.items && data.items.length > 0"
  [@submenu]="expanded ? {value: 'visible', 
        params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}} : {value: 'hidden', 
        params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}" class="sublevel-nav" >
    <li *ngFor="let item of data.items" class="sublevel-nav-item">
        <a class="sublevel-nav-link"
        (click)="handleClick(item)"
          *ngIf="item.items && item.items.length > 0" [ngClass]="getActiveClass(item)" >
          <i class="sublevel-link-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
  <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"/>
</svg></i>
          <span class="sublevel-link-text" @fadeInOut 
              *ngIf="collapsed">{{item.label}}</span>
          <i *ngIf="item.items && collapsed" class="menu-collapse-icon"
            [ngClass]="!item.expanded ? 'fa fa-angle-right' : 'fa fa-angle-down'"
          ></i>
        </a>
        <a class="sublevel-nav-link"
          *ngIf="!item.items || (item.items && item.items.length === 0)"
          [routerLink]="[item.routeLink]"
          routerLinkActive="active-sublevel"
          [routerLinkActiveOptions]="{exact: true}">
          <i class="sublevel-link-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
  <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"/>
</svg></i>
 
          <span class="sublevel-link-text" @fadeInOut 
             *ngIf="collapsed">{{item.label}}</span>
        </a>
        <div *ngIf="item.items && item.items.length > 0">
          <app-sublevel-menu
            [data]="item"
            [collapsed]="collapsed"
            [multiple]="multiple"
            [expanded]="item.expanded"
          ></app-sublevel-menu>
        </div>
    </li>
  </ul>`,
  styleUrls: ['./sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden', [style({ overflow: 'hidden' }),
      animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {

  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items: []
  }
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor(public router: Router) { }

  ngOnInit(): void { }

  handleClick(item: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getActiveClass(item: INavbarData): string {
    return item.expanded && this.router.url.includes(item.routeLink) ? 'active-sublevel' : '';
  }

}
