import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../Services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  LoginForm!: FormGroup;
  Username: any;
  Password: any;
  UserId: any;
  results: any;

  constructor(public router: Router, private service: AdminService) {
  }

  ngOnInit(): void {
    this.LoginForm = new FormGroup({
      Username: new FormControl(),
      Password: new FormControl()
    });

    const si = document.getElementById("showicon") as HTMLElement;
    si.style.display = 'block';
    const hi = document.getElementById("hideicon") as HTMLElement;
    hi.style.display = 'none';
  }

  UserNameUp() {
    const myElement = document.getElementById("userlbl");
    myElement?.classList.remove("userlbl");
    myElement?.classList.remove("userlbldown");
    myElement?.classList.add("userlblup");
  }

  UserNameDown() {
    var user = this.Username;
    if (user == '' || user == undefined) {
      const myElement = document.getElementById("userlbl");
      myElement?.classList.remove("userlblup");
      myElement?.classList.add("userlbldown");
    }

  }

  PasswordUp() {
    const myElement = document.getElementById("pwdlbl");
    myElement?.classList.remove("userlbl");
    myElement?.classList.remove("userlbldown");
    myElement?.classList.add("userlblup");
  }

  PasswordDown() {
    var pwd = this.Password;
    if (pwd == '' || pwd == undefined) {
      const myElement = document.getElementById("pwdlbl");
      myElement?.classList.remove("userlblup");
      myElement?.classList.add("userlbldown");
    }
  }

  showPwd() {
    const myElement = document.getElementById("pwdtxt");
    myElement?.setAttribute('TYPE', 'TEXT');

    const si = document.getElementById("showicon") as HTMLElement;
    si.style.display = 'none';
    const hi = document.getElementById("hideicon") as HTMLElement;
    hi.style.display = 'block';
  }

  hidePwd() {
    const myElement = document.getElementById("pwdtxt");
    myElement?.setAttribute('TYPE', 'PASSWORD');

    const si = document.getElementById("showicon") as HTMLElement;
    si.style.display = 'block';
    const hi = document.getElementById("hideicon") as HTMLElement;
    hi.style.display = 'none';
  }

  async login() {
    debugger;
    const loginData = {
      Username: this.LoginForm.value.Username,
      Password: this.LoginForm.value.Password
    };

    if(this.LoginForm.value.Username == null || this.LoginForm.value.Username == undefined){
      this.LoginForm.setErrors({ enterCredentials: true });
    }
    if(this.LoginForm.value.Password == null || this.LoginForm.value.Password == undefined){
      this.LoginForm.setErrors({ enterCredentials: true });
    }

    const data = await this.service.validateUserLogin(loginData).toPromise();
    if (data.length > 0) {
      localStorage.setItem("username", data[0].username);
      localStorage.setItem("mst_user_id", data[0].mst_user_id);
      localStorage.setItem("roleId", data[0].roleId);

      this.router.navigate(['/dashboard']);
    }
    else {
      this.LoginForm.setErrors({ invalidCredentials: true });
      localStorage.removeItem("username");
      localStorage.removeItem("mst_user_id");
      localStorage.removeItem("roleId");
    }

  }

}
