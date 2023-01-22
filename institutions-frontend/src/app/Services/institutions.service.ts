import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {InstitutionData} from '../Models/institution-data.model';
import { of, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {
  institutionList: InstitutionData[] = [];
  url = "http://localhost:3000/institutions";
  subscriptions = new Subscription();


  constructor(
    private http: HttpClient
  ) {

  }

  getinstitutions(){
    const subject = new Subject<InstitutionData[]>();
    try{
      // Returning Observable data
      this.subscriptions.add(this.http.get<InstitutionData[]>(this.url).subscribe(institutions => {
        if(institutions && institutions.length > 0) {
          this.institutionList = institutions;
          subject.next(this.institutionList);
        }
        else {
          subject.next([]);
        }
      }));
    } catch(e) {
      console.log('error', e);
      subject.next([]);
    }
    return subject.asObservable();
  }

  addInstitution(institutionData: any){
    const subject = new Subject<InstitutionData|{}>();
    try{
      // Returning Observable data
      this.subscriptions.add(
              this.http.post<InstitutionData>(this.url, institutionData)
                                                                    .subscribe(institutionResponse => {
                                                                              if(institutionResponse) {
                                                                                this.institutionList.push(institutionResponse);
                                                                                subject.next(institutionResponse);
                                                                              }
                                                                            }));
    } catch(e) {
      console.log('error', e);
      subject.next({});
    }
    return subject.asObservable();
  }

  public getInstitution(id: string){
    const subject = new Subject<InstitutionData|undefined>();
    let institution: InstitutionData|undefined;
    if(this.institutionList.length == 0 ){
      try{
        // Returning Observable data
        this.subscriptions.add(this.getinstitutions().subscribe(institutions => {
                                                                          if(institutions && institutions.length > 0) {
                                                                            this.institutionList = institutions;
                                                                            institution = this.institutionList.find(institution => institution.id === id);
                                                                            subject.next(institution);
                                                                          }
                                                                        }));
      } catch(e) {
        console.log('error', e);
        subject.next(institution);
      }
    }
    else {
      institution = this.institutionList.find(institution => institution.id === id);
      setTimeout(()=>{
        subject.next(institution);
      })
    }

    return subject.asObservable();

  }

  updateInstitution(institutionData: any, id:string){
    const subject = new Subject<InstitutionData|{}>();
    try{
      // Returning Observable data
      this.subscriptions.add(
              this.http.put<InstitutionData>(this.url + '/' + id, institutionData)
                                                                    .subscribe(institutionResponse => {
                                                                              if(institutionResponse) {
                                                                                  let index = this.institutionList.findIndex(institution => institution.id === institutionResponse.id);
                                                                                  this.institutionList.splice(index, 1, institutionResponse);
                                                                                  subject.next(institutionResponse);
                                                                              }
                                                                            }));
    } catch(e) {
      console.log('error', e);
      subject.next({});
    }
    return subject.asObservable();
  }




  deleteInstitution(id: string){
    const subject = new Subject<InstitutionData[]>();
    try{
      // Returning Observable data
      this.subscriptions.add(
              this.http.delete<InstitutionData>(this.url + '/' + id)
                                                                    .subscribe(() => {

                                                                                this.institutionList.forEach((value,index)=>{
                                                                                  if(value.id === id)
                                                                                    this.institutionList.splice(index,1);
                                                                                subject.next(this.institutionList);

                                                                            })}));
    } catch(e) {
      console.log('error', e);
      subject.next([]);
    }
    return subject.asObservable();
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

}
