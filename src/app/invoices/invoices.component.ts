import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

searchForm:FormGroup;
advancedSearch:FormGroup;

  constructor(private fb:FormBuilder, private modalService: NgbModal) { 
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });
    this.advancedSearch = this.fb.group({})
  }
  
  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content, { size:'lg', backdrop: 'static' })
  }

}
