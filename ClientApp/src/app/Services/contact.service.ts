import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, catchError, map, throwError as observableThrowError } from "rxjs";
import { ContactDto } from "../Modal/ContactDto";
import { DataService } from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class ContactService extends DataService {
  constructor(public http: HttpClient, @Inject('BASE_URL') public baseUrl: string) {
    super(http, baseUrl);
  }
  getContact(): Observable<ContactDto[]> {
    let getContactURL = "contact/GetContacts"
    return this.get(getContactURL);
  }
  getContactsById(contactId: number): Observable<ContactDto> {
    let getContactByIdUrl = "contact/GetContactById?contactId=" + contactId;
    return this.get(getContactByIdUrl);
  }
  createContact(data: ContactDto) {
    let createContactURL = "contact/AddContact/"
    return this.post(createContactURL, data);
  }
  UpdateContact(data: ContactDto) {
    let updateContactURL = "contact/UpdateContact/"
    return this.put(updateContactURL, data);
  }
  DeleteContact(contactId: number) {
    let deleteContactUrl = this.baseUrl + "contact/DeleteContact?contactId=" + contactId;
    return this.delete(deleteContactUrl);
  }
}
