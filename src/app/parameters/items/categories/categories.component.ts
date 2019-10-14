import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../parameters.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public categories: any;
  selectedRow: any;
  closeResult: string;
  categoryForm: FormGroup;
  editState: boolean = false;
  subject;

  constructor(private service: ParametersService, private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal, private auth: AuthService) { this.createForm() }

  ngOnInit() {
    this.getList();
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  createForm() {
    this.categoryForm = this.fb.group({
      Category: [null]
      
    });
  }

  getList() {
    this.service.getCategories().subscribe(
      res => {
        this.categories = Object.values(res)
        console.log(this.categories)
      }
    )
  }

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  open(content) {
    this.modalService.open(content, { backdrop: 'static' })
  }

  onSubmit() {
    if (this.editState === false) {     
      const form = this.categoryForm.value;
      console.log(form)
       this.service.addCategory(form).subscribe(
        res => { if (res) { console.log('ID ADDED', res); this.getList() }
      else { console.log('EEERROOOORRR')} }
      )
    }
    else {
      console.log('Will edit!!!!') 
    };
    this.categoryForm.reset()
  }

  editCategory(content) {
    if (this.selectedRow.idType_category) {
      this.categoryForm.patchValue({
        Category: this.selectedRow.Category,
      });
      this.open(content);
      this.editState = true;
    }
  }

  saveChanges(banksForm) {
    let dirtyValues = {};
    console.log(dirtyValues);

    Object.keys(banksForm.controls)
      .forEach(key => {
        let currentControl = banksForm.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.saveChanges(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });

    this.service.patchCategory(dirtyValues, this.selectedRow.idType_category)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação');
        this.getList() }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })

    
  };

  deleteCategory(id) {
    this.service.deleteCategory(id).subscribe(
      res => {
        if (res) {
          this.toastr.info('Categoria foi eliminada com sucesso.', 'Notificação');
          this.getList();
          this.selectedRow = null
        }
      }
    )
    console.log(id);
  }
  resetModal() {
    this.categoryForm.reset();
    this.editState = false;
  }

}
