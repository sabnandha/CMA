import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ContactDto } from '../Modal/ContactDto';
import { ContactService } from '../Services/contact.service';
import { CreateContactComponent } from '../create-contact/create-contact.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {
  public contacts: ContactDto[] = [];
  selectedContactId: number | null = null;
  @ViewChild('deleteContactModal', { static: true }) deleteContactModal!: ModalDirective;
  @ViewChild('contactComponent', { static: true }) contactComponent!: CreateContactComponent;
  isDeleteMode: boolean = false;
  constructor(
    private readonly contactService: ContactService) {

  }
  ngOnInit() {
    this.getContactListOnload();
  }

  getContactListOnload() {
    this.selectedContactId = 0;
    this.contactService.getContact().subscribe((x: ContactDto[]) => {
      this.contacts = x;
    })
  }
  createContact() {
    if (this.contactComponent != undefined) {
      this.contactComponent.openModal();
    }
  }


  updateContact(contactId: number) {
    this.selectedContactId = contactId;

  }
  openDeleteContactModal(contactId: number) {
    this.isDeleteMode = true;
    this.selectedContactId = contactId;
    this.deleteContactModal.show();
  }
  deleteContact() {
    if (this.selectedContactId! > 0) {
      this.contactService.DeleteContact(this.selectedContactId!).subscribe(x => {
        this.getContactListOnload();
        this.closeDeleteModal();

      })
    }
  }
  closeDeleteModal() {
    this.resetModal();
    this.deleteContactModal.hide();
  }
  resetModal() {
    this.isDeleteMode = false;
    this.selectedContactId = 0;
  }
}
