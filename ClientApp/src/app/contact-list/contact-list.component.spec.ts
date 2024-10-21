import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { ContactDto } from '../Modal/ContactDto';
import { ContactService } from '../Services/contact.service';
import { CreateContactComponent } from '../create-contact/create-contact.component';
import { ContactListComponent } from './contact-list.component';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['getContact', 'DeleteContact']);

    await TestBed.configureTestingModule({
      declarations: [ContactListComponent, CreateContactComponent],
      imports: [ModalModule.forRoot()],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // This will ignore unknown child component templates like CreateContactComponent
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on initialization', () => {
    const mockContacts: ContactDto[] = [
      { contactId: 1, firstName: 'John', lastName: 'Peter', email: 'john@example.com' },
      { contactId: 2, firstName: 'Vignesh', lastName:'Raj', email: 'vignesh@example.com' }
    ];
    contactService.getContact.and.returnValue(of(mockContacts));

    component.ngOnInit();
    fixture.detectChanges();

    expect(contactService.getContact).toHaveBeenCalled();
    expect(component.contacts).toEqual(mockContacts);
  });

  it('should open create contact modal', () => {
    spyOn(component.contactComponent, 'openModal');

    component.createContact(); 
    expect(component.contactComponent.openModal).toHaveBeenCalled();
  });

  it('should update contact ID and show the contact component', () => {
    const contactId = 1;
    component.updateContact(contactId);

    expect(component.selectedContactId).toEqual(contactId); 
  });

  it('should open delete contact modal', () => {
    spyOn(component.deleteContactModal, 'show');
    const contactId = 1;

    component.openDeleteContactModal(contactId);

    expect(component.isDeleteMode).toBeTrue();
    expect(component.selectedContactId).toEqual(contactId);
    expect(component.deleteContactModal.show).toHaveBeenCalled();
  });

  it('should call deleteContact and refresh the contact list', () => {
    const contactId = 1;
    const mockResponse = true;
    spyOn(component, 'getContactListOnload');
    spyOn(component, 'closeDeleteModal');
    contactService.DeleteContact.and.returnValue(of(mockResponse));

    component.selectedContactId = contactId;
    component.deleteContact();

    expect(contactService.DeleteContact).toHaveBeenCalledWith(contactId);
    expect(component.getContactListOnload).toHaveBeenCalled();
    expect(component.closeDeleteModal).toHaveBeenCalled();
  });

  it('should close delete modal and reset modal state', () => {
    spyOn(component.deleteContactModal, 'hide');
    component.closeDeleteModal();

    expect(component.isDeleteMode).toBeFalse();
    expect(component.selectedContactId).toBe(0);
    expect(component.deleteContactModal.hide).toHaveBeenCalled();
  }); 
});
