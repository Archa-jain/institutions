import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { InstitutionsListComponent } from './institutions-list.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InstitutionsListComponent', () => {
  let component: InstitutionsListComponent;
  let fixture: ComponentFixture<InstitutionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
       ],
      declarations: [ InstitutionsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set filter for province when drop down is changed and reset city filter', () => {
    component.filterState['city'] = 'Halifax'
    expect(component.filterState['province']).toBe('');
    component.applyProvinceSearch({value: 'Ontario'});
    expect(component.filterState['province']).toBe('Ontario');
    expect(component.filterState['city']).toBe('');

  })

  it('should reset the city filter when none is selected in city drop down', () => {
    component.applyCitySearch({value: 'Ottawa'})
    expect(component.filterState['city']).toBe('Ottawa');
    component.applyCitySearch({value: ''});
    expect(component.filterState['city']).toBe('');
  })

  it('should set filter for city when drop down is changed', () => {
    component.filterState['city'] = '';
    component.applyCitySearch({value: 'Ottawa'});
    expect(component.filterState['city']).toBe('Ottawa');

  })

  it('should reset search field if search text is removed', () => {
    component.applySearch('first');
    expect(component.filterState['keyword']).toBe('first');
    component.applySearch('');
    expect(component.filterState['keyword']).toBe('');
  })

  it('should set search field if search text is typed', () => {
    component.filterState['keyword'] = '';
    component.applySearch('first');
    expect(component.filterState['keyword']).toBe('first');

  })
});
