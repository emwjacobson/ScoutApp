import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  public register_form = {
    email: '',
    displayName: '',
    password: ''
  };

  constructor() { }

  ngOnInit() {
  }

}
