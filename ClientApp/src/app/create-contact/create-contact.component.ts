import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ContactService } from '../Services/contact.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ValidationHelper } from '../Utility/validation-helper';
import { ContactDto } from '../Modal/ContactDto';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {
  @Input() selectedContactId: number = 0;
  @Input() isDeleteMode: boolean=false;
  contactForm!: FormGroup;
  @Output() saveClick = new EventEmitter();
  @Output() closeClick = new EventEmitter();
  @ViewChild('contactModal', { static: true }) contactModal!: ModalDirective;
  submitted = false; // New flag to track form submission
  constructor(private formBuilder: FormBuilder,
    private readonly contactService: ContactService) {
    this.contactForm = this.formBuilder.group({
      contactId:[0],
      email: [
        '', 
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }
  ngOnInit() {
   
  }
  ngOnChanges(changes: SimpleChanges) {

    // If selectedContactId changes, update the form and show the modal
    if (changes['selectedContactId'] && this.contactModal && !this.isDeleteMode) {
      if (this.selectedContactId > 0) {
        // Load the contact for editing
        this.contactService.getContactsById(this.selectedContactId).subscribe(contact => {
          this.contactForm.patchValue({
            contactId: contact.contactId,
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
          });
          // Show the modal once the data is loaded
          this.contactModal.show();
        });
      }  
    }
  }
 
  openModal() {
    this.contactForm.reset();
    this.contactModal.show();
  }

  closeModal() { 
    this.contactModal.hide();
    this.resetForm(); // Reset form and submitted flag when closing the modal
    this.closeClick.emit(true);
  }
  resetForm() {
    this.contactForm.reset();
    this.selectedContactId = 0;
    this.isDeleteMode = false;
    this.submitted = false; // Reset submitted so validation errors are hidden until next save attempt
  }

  saveContactForm() {
    this.submitted = true; // Mark as submitted when saving the form
    if (this.contactForm.invalid) {
      ValidationHelper.validateAllFormFields(this.contactForm);
      return;
    }
    else {
      let contactDto: ContactDto = new ContactDto();
      contactDto = Object.assign({}, this.contactForm.value);
      if (contactDto.contactId > 0) {
        this.updateContact(contactDto); 
      }
        
      else {
        contactDto.contactId=0;
        this.createContact(contactDto); 
      }
        
     
    
    }
  }
  createContact(data: ContactDto) {
    this.contactService.createContact(data).subscribe(x => {
      this.contactModal.hide();
      this.saveClick.emit(true);
      this.resetForm(); // Reset form and submitted flag after successful save
    })
  }

  updateContact(data: ContactDto) {
    this.contactService.UpdateContact(data).subscribe(x => {
      this.contactModal.hide();
      this.saveClick.emit(true);
      this.resetForm(); // Reset form and submitted flag after successful save
    })
  }
}
