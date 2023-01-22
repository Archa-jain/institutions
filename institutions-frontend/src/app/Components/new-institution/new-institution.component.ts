import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { State, City }  from 'country-state-city';
import { IState, ICity } from 'country-state-city';
import { InstitutionData } from 'src/app/Models/institution-data.model';
import { InstitutionsService } from 'src/app/Services/institutions.service';

@Component({
  selector: 'app-new-institution',
  templateUrl: './new-institution.component.html',
  styleUrls: ['./new-institution.component.scss']
})
export class NewInstitutionComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  titleAlert: string = 'This field is required';
  institutionId!: string;
  institutionData!: InstitutionData;
  subscriptions = new Subscription();
  provinces!: Array<IState>;
  cities!: Array<ICity>;
  sectorList = ['Public', 'For-Profit', 'Non-Profit'];
  statusList = ['Registered', 'Recognized', 'Authorized']; //hardcoded for now, incase some more sector types and statuses can be defined
                                                          // then they can be fetched from backend

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedroute:ActivatedRoute,
              private institutionsService : InstitutionsService
              ) { }

  ngOnInit() {
    this.createForm();
    this.provinces = State.getStatesOfCountry('CA');
    this.subscriptions.add(this.activatedroute.paramMap.subscribe(params => {
                                                        this.institutionId = params.get('id') as string;
                                                        if(this.institutionId){
                                                          this.institutionsService.getInstitution(this.institutionId).subscribe(institution => {
                                                            if(institution){
                                                              this.updateCities(institution.province);
                                                              this.institutionData = institution;
                                                              this.setFormValues(this.institutionData);
                                                            }
                                                            else {
                                                              this.router.navigate(['']);
                                                            }
                                                          })
                                                        }
    }));
  }

  updateCities(value:string) {
    const selectedProvince = this.provinces.find(province => province.name === value);
    if(selectedProvince)
		  this.cities = City.getCitiesOfState('CA', selectedProvince.isoCode);
	}

  createForm() {
    this.formGroup = this.formBuilder.group({
      'name': [null, Validators.required],
      'province': [null, Validators.required],
      'city': [null, [Validators.required]],
      'sector': [null, Validators.required],
      'legalStatus': [null, Validators.required]
    });
  }

  setFormValues(institutionData: InstitutionData){
    this.formGroup.setValue({
      'name': institutionData.name,
      'province': institutionData.province,
      'city': institutionData.city,
      'sector': institutionData.sector,
      'legalStatus': institutionData.legalStatus
    });
  }

  formatFormData(institutionData:InstitutionData){
    let data = {
              'name': institutionData.name,
              'province': institutionData.province,
              'city': institutionData.city,
              'sector': institutionData.sector,
              'legalStatus': institutionData.legalStatus
            }
    return data;
  }

  onSubmit(formData: any) {
    let post = this.formatFormData(formData);
    if(this.institutionData){
      this.subscriptions.add(this.institutionsService.updateInstitution(post, this.institutionData.id).subscribe( institution => {
        if(institution){
          console.log("Institution successfully updated", institution);
          this.submitSuccessful();
        }
      }));
    }
    else{
      this.subscriptions.add(this.institutionsService.addInstitution(post).subscribe( institution => {
        console.log("Institution successfully added", institution);
        this.submitSuccessful();
      }));
    }
  }

  private submitSuccessful() {
    this.formGroup.reset();
    this.router.navigate(['']);
  }

  cancel(){
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}

