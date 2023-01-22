import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { InstitutionData } from "../../Models/institution-data.model";
import { InstitutionsService } from '../../Services/institutions.service';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import { Subscription } from 'rxjs';
import { State, City }  from 'country-state-city';
import { IState, ICity } from 'country-state-city'
import { AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-institutions-list',
  templateUrl: './institutions-list.component.html',
  styleUrls: ['./institutions-list.component.scss']
})
export class InstitutionsListComponent implements OnInit, OnDestroy {

  displayedColumns = ['name', 'city', 'province', 'sector', 'legalStatus', 'action'];
  dataSource: MatTableDataSource<InstitutionData> = new MatTableDataSource();
  provinces!: Array<IState>;
  cities!: Array<ICity>;
  filterState = {
    keyword: '',
    province: '',
    city: '',
  }

 @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  subscriptions = new Subscription();

  constructor(
    private router: Router,
    private institutionsService : InstitutionsService,
    private dialog : MatDialog,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.provinces = State.getStatesOfCountry('CA');
    let cities = City.getCitiesOfCountry('CA');
    if(cities)
      this.cities = cities;
    this.subscriptions.add(this.institutionsService.getinstitutions().subscribe( (institutions) => {
                                                                                    if(institutions) {
                                                                                      // Assign the data to the data source for the table to render
                                                                                      this.dataSource = new MatTableDataSource(institutions);
                                                                                      this.setTableDataSourceOptions();
                                                                                    }
                                                                                  }));

  }

  applyProvinceSearch(event:any) {
    if (!event.value) {
      this.cities = City.getCitiesOfCountry('CA')!;
    } else {
      const selectedProvince = this.provinces.find(province => province.name === event.value);
      if(selectedProvince)
        this.cities = City.getCitiesOfState('CA', selectedProvince.isoCode);
      this.filterState['city'] = '';
    }
    this.filterState['province'] = event.value;
    this.dataSource.filter = 'province';
	}

  applyCitySearch(event:any) {
    this.filterState['city'] = event.value;
    this.dataSource.filter = 'city';
	}

  applySearch(searchValue: string) {
    searchValue = searchValue.trim(); // Remove whitespace
    searchValue = searchValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.filterState['keyword'] = searchValue;
    this.dataSource.filter = 'keyword';
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    if(this.dataSource) {
      this.setTableDataSourceOptions();

    }
  }

  redirectToNewInstitution(){
    this.router.navigate(['/new-institution']);
  }

  editInstitution(event: any){
    this.router.navigate(['/institution',event.id]);
  }

  deleteInstitution(event:any){
      let dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        height :'auto'
      });

      this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
          if( result ) {
            this.subscriptions.add(this.institutionsService.deleteInstitution(event.id).subscribe( institutions => {
              this.dataSource = new MatTableDataSource(institutions);
              this.setTableDataSourceOptions();
            }));
          }

      }));
     }

    setTableDataSourceOptions() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
        return data[sortHeaderId].toLocaleLowerCase();
      };
      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !this.filterState.keyword || data.name.toLowerCase().includes(this.filterState.keyword);
        const b = !this.filterState.province || data.province === this.filterState.province;
        const c = !this.filterState.city || data.city === this.filterState.city;
        return a && b && c;
      })
    }

}
