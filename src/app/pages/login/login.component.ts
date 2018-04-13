import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public login_form = {
    email: '',
    password: ''
  };

  constructor() { }

  ngOnInit() {
  }

  public login() {
    console.log(this.login_form);
  }

}
