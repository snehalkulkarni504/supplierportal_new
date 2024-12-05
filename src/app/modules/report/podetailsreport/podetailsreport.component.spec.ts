import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodetailsreportComponent } from './podetailsreport.component';

describe('PodetailsreportComponent', () => {
  let component: PodetailsreportComponent;
  let fixture: ComponentFixture<PodetailsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodetailsreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodetailsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
