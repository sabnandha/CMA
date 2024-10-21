import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateContactComponent } from './create-contact.component';
import { ContactService } from '../Services/contact.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { ContactDto } from '../Modal/ContactDto';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValidationHelper } from '../Utility/validation-helper';

describe('CreateContactComponent', () => {
  let component: CreateContactComponent;
  let fixture: ComponentFixture<CreateContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['getContactsById', 'createContact', 'UpdateContact']);

    await TestBed.configureTestingModule({
      declarations: [CreateContactComponent],
      imports: [ReactiveFormsModule, ModalModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: ContactService, useValue: contactServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown child component templates
    }).compileComponents();

    fixture = TestBed.createComponent(CreateContactComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.controls['email']).toBeDefined();
    expect(component.contactForm.controls['firstName']).toBeDefined();
    expect(component.contactForm.controls['lastName']).toBeDefined();
  });

  it('should load contact details when selectedContactId changes', () => {
    const mockContact: ContactDto = {
      contactId: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    contactService.getContactsById.and.returnValue(of(mockContact));
    component.selectedContactId = 1;
    component.isDeleteMode = false;

    component.ngOnChanges({
      selectedContactId: {
        currentValue: 1,
        previousValue: 0,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(contactService.getContactsById).toHaveBeenCalledWith(1);
    expect(component.contactForm.value).toEqual({
      contactId: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });
  });

  it('should open the modal and reset the form', () => {
    spyOn(component.contactModal, 'show');
    component.openModal();

    expect(component.contactForm.value).toEqual({
      contactId: null,
      email: '',
      firstName: '',
      lastName: ''
    });
    expect(component.contactModal.show).toHaveBeenCalled();
  });

  it('should close the modal and emit closeClick event', () => {
    spyOn(component.contactModal, 'hide');
    spyOn(component.closeClick, 'emit');

    component.closeModal();

    expect(component.contactModal.hide).toHaveBeenCalled();
    expect(component.closeClick.emit).toHaveBeenCalledWith(true);
  });

  it('should set submitted to true and validate form fields when saving an invalid form', () => {
    spyOn(ValidationHelper, 'validateAllFormFields');
    component.contactForm.controls['email'].setValue(''); // Invalid email

    component.saveContactForm();

    expect(component.submitted).toBeTrue();
    expect(ValidationHelper.validateAllFormFields).toHaveBeenCalledWith(component.contactForm);
    expect(component.contactForm.invalid).toBeTrue();
  });

  it('should create a contact when form is valid and contactId is 0', () => {
    spyOn(component, 'createContact');
    component.contactForm.patchValue({
      contactId: 0,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });

    component.saveContactForm();

    expect(component.createContact).toHaveBeenCalledWith(jasmine.objectContaining({
      contactId: 0,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    }));
  });

  it('should update a contact when form is valid and contactId is greater than 0', () => {
    spyOn(component, 'updateContact');
    component.contactForm.patchValue({
      contactId: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });

    component.saveContactForm();

    expect(component.updateContact).toHaveBeenCalledWith(jasmine.objectContaining({
      contactId: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    }));
  });

  it('should create a contact and reset the form after successful creation', () => {
    const mockContact: ContactDto = {
      contactId: 0,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    spyOn(component.contactModal, 'hide');
    spyOn(component.saveClick, 'emit');
    contactService.createContact.and.returnValue(of(mockContact));

    component.createContact(mockContact);

    expect(contactService.createContact).toHaveBeenCalledWith(mockContact);
    expect(component.contactModal.hide).toHaveBeenCalled();
    expect(component.saveClick.emit).toHaveBeenCalledWith(true);
    expect(component.submitted).toBeFalse();
  });

  it('should update a contact and reset the form after successful update', () => {
    const mockContact: ContactDto = {
      contactId: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    spyOn(component.contactModal, 'hide');
    spyOn(component.saveClick, 'emit');
    contactService.UpdateContact.and.returnValue(of(mockContact));

    component.updateContact(mockContact);

    expect(contactService.UpdateContact).toHaveBeenCalledWith(mockContact);
    expect(component.contactModal.hide).toHaveBeenCalled();
    expect(component.saveClick.emit).toHaveBeenCalledWith(true);
    expect(component.submitted).toBeFalse();
  });
});
