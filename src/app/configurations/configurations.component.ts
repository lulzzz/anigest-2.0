import { Component, OnInit } from '@angular/core';
import { ConfigurationsService } from './configurations.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {

  subject;

  constructor(private service: ConfigurationsService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.currentUserSubject.subscribe(message => {
      this.subject = message,
        console.log(this.subject)
      });
  }

}
