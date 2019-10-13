import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerService } from '../add-student/server.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  @Input() idStudent: any;

  constructor(private bs: ServerService, public activeModal: NgbActiveModal) { }

  ngOnInit() {

 /*    this.bs.getStudent(this.idStudent).subscribe(
      (data) => this.editStudent(data),
      )
  }; */
  
  }
}
