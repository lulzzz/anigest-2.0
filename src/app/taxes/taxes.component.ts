import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaxFormComponent } from './tax-form/tax-form.component';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent implements OnInit {

searchForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.createForm();
   }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  addTax(){
  this.modalService.open(TaxFormComponent, {size: 'lg', backdrop: 'static'});
    

  }

}
