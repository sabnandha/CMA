import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ContactListComponent } from './contact-list/contact-list.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from './Services/contact.service';
import { CreateContactComponent } from './create-contact/create-contact.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    ContactListComponent,
    CreateContactComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    CommonModule,
    RouterModule.forRoot([
      { path: '', component: ContactListComponent, pathMatch: 'full' },
      /*{ path: '', component: HomeComponent, pathMatch: 'full' },*/
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent }
      
    ])
  ],
  providers: [ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
