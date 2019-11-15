import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServerService } from './student/add-student/server.service';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { SchoolsComponent } from './schools/schools.component';
import { ExamsComponent } from './exams/exams.component';
import { AddSchoolComponent } from './schools/add-school/add-school.component';
import { SchoolService } from './schools/school.service';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { FormsModule } from '@angular/forms';
import { OperatorsComponent } from './operators/operators.component';
import { AddOperatorComponent } from './operators/add-operator/add-operator.component';
import { OperatorService } from './operators/operator.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from './guards/auth.guard';
import { SharedService } from './services/shared.service';
import { AddRoleComponent } from './operators/add-role/add-role.component';
import { NotesComponent } from './student/notes/notes.component';
import { EditExamComponent } from './exams/edit-exam/edit-exam.component';
import { ResultsComponent } from './results/results.component';
import { ExaminersComponent } from './examiners/examiners.component';
import { ChecksComponent } from './checks/checks.component';
import { PaymentsComponent } from './payments/payments.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { TaxesComponent } from './taxes/taxes.component';
import { AddCheckComponent } from './checks/add-check/add-check.component';
import { ExaminerFormComponent } from './examiners/examiner-form/examiner-form.component';
import { ExaminerServiceService } from './examiners/examiner-service.service';
import { PayFormComponent } from './payments/pay-form/pay-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TaxFormComponent } from './taxes/tax-form/tax-form.component';
import { ExamService } from './exams/exam.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BookingsComponent } from './bookings/bookings.component';
import { AddBookingComponent } from './bookings/add-booking/add-booking.component';
import { BookingService } from './bookings/booking.service';
import { TextMaskModule } from 'angular2-text-mask';
import { ResultsService } from './results/results.service';
import { PaymentsService } from './payments/payments.service';
import { ParametersComponent } from './parameters/parameters.component';
import { BanksComponent } from './parameters/items/banks/banks.component';
import { IdsComponent } from './parameters/items/ids/ids.component';
import { ParametersService } from './parameters/parameters.service';
import { ExamTypesComponent } from './parameters/items/exam-types/exam-types.component';
import { IvaComponent } from './parameters/items/iva/iva.component';
import { StatusComponent } from './parameters/items/status/status.component';
import { PresultsComponent } from './parameters/items/presults/presults.component';
import { DsvComponent } from './parameters/items/dsv/dsv.component';
import { ExamLocationsComponent } from './parameters/items/exam-locations/exam-locations.component';
import { CategoriesComponent } from './parameters/items/categories/categories.component';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { Ce1Component } from './configurations/centers/ce1/ce1.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReservationsService } from './reservations/reservations.service';
import { ConfigurationsService } from './configurations/configurations.service';
import { NgDraggableModule } from 'angular-draggable';
import { EditReservationComponent } from './reservations/edit-reservation/edit-reservation.component';
import { EditBookingComponent } from './bookings/edit-booking/edit-booking.component';
import { EditResultsComponent } from './results/edit-results/edit-results.component';
import { ListagensComponent } from './examiners/listagens/listagens.component';
import { SICCComponent } from './sicc/sicc.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { CalendarModule as PrimeCalendar } from 'primeng/calendar'
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages'
import { SpinnerModule } from 'primeng/spinner'
import { ScheduleModule } from './reservations/horario/schedule/module';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';
import { HorarioComponent } from './reservations/horario/horario.component';
import {NgxPrintModule} from 'ngx-print';

registerLocaleData(localePt, 'pt-PT');


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    routingComponents,
    EditStudentComponent,
    SchoolsComponent,
    ExamsComponent,
    AddSchoolComponent,
    LoginComponent,
    OperatorsComponent,
    AddOperatorComponent,
    AddRoleComponent,
    NotesComponent,
    EditExamComponent,
    ResultsComponent,
    ExaminersComponent,
    ChecksComponent,
    PaymentsComponent,
    InvoicesComponent,
    TaxesComponent,
    AddCheckComponent,
    ExaminerFormComponent,
    PayFormComponent,
    TaxFormComponent,
    BookingsComponent,
    AddBookingComponent,
    ParametersComponent,
    BanksComponent,
    IdsComponent,
    ExamTypesComponent,
    IvaComponent,
    StatusComponent,
    PresultsComponent,
    DsvComponent,
    ExamLocationsComponent,
    CategoriesComponent,
    ConfigurationsComponent,
    Ce1Component,
    ReservationsComponent,
    EditReservationComponent,
    EditBookingComponent,
    EditResultsComponent,
    ListagensComponent,
    SICCComponent,
    HorarioComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    TextMaskModule,
    NgDraggableModule,
    AngularDualListBoxModule,
    PrimeCalendar,
    ConfirmDialogModule,
    MessagesModule,
    SpinnerModule,
    MenuModule,
    DropdownModule,
    ScheduleModule,
    TreeModule,
    NgxPrintModule
  ],
  providers: [DatePipe, SharedService, ConfigurationsService, ReservationsService, ParametersService, PaymentsService, ServerService, SchoolService, AuthService, OperatorService, ExaminerServiceService, ExamService, BookingService, ResultsService, NgbActiveModal, AuthGuard, SharedService, { provide: LOCALE_ID, useValue: 'pt-PT' }, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true} ],
  bootstrap: [AppComponent]
})


export class AppModule { 
  
}

