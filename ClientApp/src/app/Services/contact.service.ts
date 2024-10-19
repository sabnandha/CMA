import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, catchError, map, throwError as observableThrowError } from "rxjs";
import { ContactDto } from "../Modal/ContactDto";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(public http: HttpClient, @Inject('BASE_URL') public baseUrl: string) {
   
  }
  getContact(): Observable<ContactDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Specify JSON content type
    });

    let getContactURL = this.baseUrl + "weatherforecast/GetContacts"
    return this.http.get(getContactURL, { headers })
      .pipe(
        map((res:any) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }
  getContactsById(contactId: number): Observable<ContactDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Specify JSON content type
    });

    let getContactByIdUrl = this.baseUrl + "weatherforecast/GetContactById?contactId=" + contactId;
    return this.http.get(getContactByIdUrl, { headers })
      .pipe(
        map((res: any) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }
  createContact(model: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Specify JSON content type
    });

    let createContactURL = this.baseUrl +"weatherforecast/AddContact/"
    return this.http.post(createContactURL, JSON.stringify(model), { headers })
      .pipe(
        map((res) => {
          
          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }
  UpdateContact(model: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Specify JSON content type
    });

    let updateContactURL = this.baseUrl + "weatherforecast/UpdateContact/"
    return this.http.put(updateContactURL, JSON.stringify(model), { headers })
      .pipe(
        map((res) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }
  DeleteContact(contactId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Specify JSON content type
    });

    let deleteContactUrl = this.baseUrl + "weatherforecast/DeleteContact?contactId=" + contactId;
    return this.http.delete(deleteContactUrl,{ headers })
      .pipe(
        map((res) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }
 
  private handleError(result: any) {

    if (result.status === 400 || result.status === 404) {
      console.log("in 400")
      console.log(result);
         
      return observableThrowError(result);
    }
    if (result.status === 500) {
      console.log("in 500")
      console.log(result);
    
      return observableThrowError(result);
    }
    if (result.status === 403) {

      console.log("in 403")
      console.log(result);
    }
   
   if (result.status !== 401) {
      
    }


    if (result.headers === undefined) {
      return observableThrowError(result);
    }

    const applicationError = result.headers.get('Application-Error');
    return observableThrowError(applicationError || 'Server error');
  }
}
