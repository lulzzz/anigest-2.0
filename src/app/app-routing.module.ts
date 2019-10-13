import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { StudentComponent } from './student/student.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { SchoolsComponent } from './schools/schools.component';
import { ExamsComponent } from './exams/exams.component';
import { AddSchoolComponent } from './schools/add-school/add-school.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OperatorsComponent } from './operators/operators.component';
import { AddOperatorComponent } from './operators/add-operator/add-operator.component';
import { AuthGuard } from './guards/auth.guard';
import { AddRoleComponent } from './operators/add-role/add-role.component'
import { NotesComponent } from './student/notes/notes.component';
import { EditExamComponent } from './exams/edit-exam/edit-exam.component';
import { ResultsComponent } from './results/results.component';
import { ExaminersComponent } from './examiners/examiners.component';
import { ChecksComponent } from './checks/checks.component';
import { PaymentsComponent } from './payments/payments.component';
import { AddCheckComponent } from './checks/add-check/add-check.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ExaminerFormComponent } from './examiners/examiner-form/examiner-form.component';
import { PayFormComponent } from './payments/pay-form/pay-form.component';
import { TaxesComponent } from './taxes/taxes.component';
import { BookingsComponent } from './bookings/bookings.component';
import { AddBookingComponent } from './bookings/add-booking/add-booking.component';
import { TaxFormComponent } from './taxes/tax-form/tax-form.component';
import { ParametersComponent } from './parameters/parameters.component';
import { BanksComponent } from './parameters/items/banks/banks.component';
import { IdsComponent } from './parameters/items/ids/ids.component';
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
import { EditReservationComponent } from './reservations/edit-reservation/edit-reservation.component';
import { EditBookingComponent } from './bookings/edit-booking/edit-booking.component';
import { ListagensComponent } from './examiners/listagens/listagens.component';
import { SICCComponent } from './sicc/sicc.component';
import { HorarioComponent } from './reservations/horario/horario.component';
import { EditResultsComponent } from './results/edit-results/edit-results.component';



const routes: Routes = [
  // { path: 'student', component: StudentComponent},
  //  { path: 'student/:id', component: AddStudentComponent}
  {
    path: '',
    component: NavbarComponent,
    canActivate: [AuthGuard]
  },

  { path: 'login', component: LoginComponent },

  {
    path: 'student',
    component: StudentComponent,
    children: [
      { path: 'add-student', component: AddStudentComponent },
      { path: 'edit-student/:idStudent', component: EditStudentComponent },
      { path: 'notes/:idStudent', component: NotesComponent }
    ]
  },

  {
    path: 'schools',
    component: SchoolsComponent,
    children: [
      { path: 'add-school', component: AddSchoolComponent },
    ]
  },

  {
    path: 'exams', component: ExamsComponent,
    children: [
      { path: 'edit-exam', component: EditExamComponent }
    ]
  },

  {
    path: 'operators',
    component: OperatorsComponent,
    children: [
      { path: 'add-operator', component: AddOperatorComponent },
      { path: 'add-role', component: AddRoleComponent }
    ]
  },

  {
    path: 'results', component: ResultsComponent,
    children: [
      { path: 'edit-results', component: EditResultsComponent },
    ]
  },
  {
    path: 'examiners', component: ExaminersComponent,
    children: [
      { path: 'examiner-form', component: ExaminerFormComponent },
      { path: 'listagens', component: ListagensComponent },
    ]
  },

  { path: 'invoices', component: InvoicesComponent },
  {
    path: 'checks', component: ChecksComponent,
    children: [
      { path: 'add-check', component: AddCheckComponent }
    ]
  },

  {
    path: 'payments', component: PaymentsComponent,
    children: [
      { path: 'add-payment', component: PayFormComponent },
    ]
  },
  {
    path: 'taxes', component: TaxesComponent,
    children: [
      { path: 'tax-form', component: TaxFormComponent },
    ]
  },

  {
    path: 'bookings', component: BookingsComponent,
    children: [
      { path: 'add-booking', component: AddBookingComponent },
      { path: 'edit-booking', component: EditBookingComponent }
    ]
  },

  {
    path: 'parameters', component: ParametersComponent,
    children: [
      { path: 'banks', component: BanksComponent },
      { path: 'ids', component: IdsComponent },
      { path: 'exams', component: ExamTypesComponent },
      { path: 'iva', component: IvaComponent },
      { path: 'status', component: StatusComponent },
      { path: 'results', component: PresultsComponent },
      { path: 'dsv', component: DsvComponent },
      { path: 'exam_locations', component: ExamLocationsComponent },
      { path: 'categories', component: CategoriesComponent }
    ]
  },
  {
    path: 'configurations', component: ConfigurationsComponent,
    children: [
      { path: 'ce1', component: Ce1Component }]
  },
  {
    path: 'reservations', component: ReservationsComponent,
    children: [
      { path: 'edit-reservation', component: EditReservationComponent },
    ]
  },
  { path: 'reservations/:horario', component: HorarioComponent },
  { path: 'results/:horario', component: HorarioComponent },
  {
    path: 'SICC', component: SICCComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [StudentComponent,
  AddStudentComponent,
  EditStudentComponent,
  SchoolsComponent,
  AddSchoolComponent,
  LoginComponent,
  NavbarComponent,
  OperatorsComponent,
  AddOperatorComponent,
  AddRoleComponent,
  NotesComponent,
  EditExamComponent,
  ResultsComponent,
  ExaminersComponent,
  ChecksComponent,
  PaymentsComponent,
  AddCheckComponent,
  InvoicesComponent,
  ExaminerFormComponent,
  PayFormComponent,
  TaxesComponent,
  BookingsComponent,
  TaxFormComponent,
  BanksComponent,
  IdsComponent,
  ExamTypesComponent,
  IvaComponent,
  PresultsComponent,
  StatusComponent,
  DsvComponent,
  ExamLocationsComponent,
  CategoriesComponent,
  ConfigurationsComponent,
  Ce1Component,
  ReservationsComponent,
  EditReservationComponent,
  EditBookingComponent,
  ListagensComponent,
  SICCComponent,
  HorarioComponent,
  EditResultsComponent
]

