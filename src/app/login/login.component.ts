import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../Services/admin.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule, ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { DomSanitizer } from '@angular/platform-browser';






@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxLoadingModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  @ViewChild('ngxLoading', { static: false })
  ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false })
  customLoadingTemplate!: TemplateRef<any>;
  @ViewChild('emptyLoadingTemplate', { static: false })
  emptyLoadingTemplate!: TemplateRef<any>;
  showingTemplate = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;

  public coloursEnabled = false;
  public loadingTemplate!: TemplateRef<any>;
  public config = {
    animationType: ngxLoadingAnimationTypes.circleSwish,
    primaryColour: '#0056b3',
    secondaryColour: '#ffffff',
    tertiaryColour: '#1976d2',
    backdropBorderRadius: '8px',
  };



  LoginForm!: FormGroup;
  OtpForm!: FormGroup;
  Username: any;
  Password: any;

  UserId: any;
  results: any;
  otppopup = false;
  otpCode: string = '';
  otpError: string = '';

  constructor(
    public router: Router,
    private service: AdminService,
    public toaster: ToastrService,
    private sanitizer: DomSanitizer,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.LoginForm = new FormGroup({
      Username: new FormControl(),
      Password: new FormControl()
    });


    this.OtpForm = new FormGroup
      (
        {
          otpcode: new FormControl()
        }
      )
    this.otpCode = this.OtpForm.value.otpcode;



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

    if (this.LoginForm.value.Username == null || this.LoginForm.value.Username == undefined) {
      this.LoginForm.setErrors({ enterCredentials: true });
    }
    if (this.LoginForm.value.Password == null || this.LoginForm.value.Password == undefined) {
      this.LoginForm.setErrors({ enterCredentials: true });
    }

    const data = await this.service.validateUserLogin(loginData).toPromise();
    if (data.length > 0 && data[0].userType == 1) {
      localStorage.setItem("username", data[0].username);
      localStorage.setItem("mst_user_id", data[0].mst_user_id);
      localStorage.setItem("roleId", data[0].roleId);
      localStorage.setItem("supplierId", data[0].supplierId)
      console.log('localStorage', localStorage);
      this.router.navigate(['/module']);
    }
    else if (data.length > 0 && data[0].userType == 2) {
      if (data[0].authSecretCode == "1") {
        this.otppopup = true;
        this.UserId = data[0].mst_user_id;
        localStorage.setItem("username", data[0].username);
        localStorage.setItem("mst_user_id", data[0].mst_user_id);
        localStorage.setItem("roleId", data[0].roleId);
        localStorage.setItem("supplierId", data[0].supplierId)
        console.log('localStorage', localStorage);
      }
      else {
        //this.toaster.error("Please Register to Authenticator App")
        this.otpError = 'Please Register to Authenticator App';
      }
    }
    else {
      this.LoginForm.setErrors({ invalidCredentials: true });
      localStorage.removeItem("username");
      localStorage.removeItem("mst_user_id");
      localStorage.removeItem("roleId");
      localStorage.removeItem("supplierId")
    }

  }

  showSuccessModal: boolean = false;
  async verifyOtp() {
    debugger;
    // this.cdr.detectChanges();
    this.loading = true;
    let data = { id: this.UserId, otp: this.otpCode }
    this.service.validateotp(data).subscribe
      ({
        next: (Res) => {
          setTimeout(() => {
            this.otppopup = false;
            this.otpCode = '';
            this.loading = false;
            this.showSuccessModal = true;
          }, 1800);
          this.playSuccessSound(); 

          setTimeout(() => {
            this.showSuccessModal = false;
            this.router.navigate(['/module']);
          }, 5000);

        },
        error: (error) => {
          this.loading = false;
          this.otpError = 'Invalid OTP. Please try again.';
          this.playerrorSound();
        }
      });


  }


  closeOtpModal() {
    this.otppopup = false;
    this.otpCode = '';
    this.otpError = '';
  }


  otpArray: string[] = new Array(6).fill('');

  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (!/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    this.otpArray[index] = value;

    if (index < this.otpArray.length - 1) {
      const nextInput = document.getElementById('otp' + (index + 1)) as HTMLInputElement;
      nextInput?.focus();
    }

    this.updateOtpCode();
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      if (this.otpArray[index]) {
        this.otpArray[index] = '';
      } else if (index > 0) {
        const prevInput = document.getElementById('otp' + (index - 1)) as HTMLInputElement;
        prevInput?.focus();
        this.otpArray[index - 1] = '';
      }
      this.updateOtpCode();
    }
  }

  updateOtpCode() {
    this.otpCode = this.otpArray.join('');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.otppopup) this.closeOtpModal();
  }

  ngAfterViewInit(): void {
    if (this.otppopup) {
      setTimeout(() => {
        const otpInput = document.querySelector('.otp-input') as HTMLInputElement;
        otpInput?.focus();
      }, 0);
    }
  }


  playSuccessSound() {
    const audio = new Audio();
    audio.src = 'assets/sounds/success.wav';
    audio.load();
    audio.play();
    audio.volume = 1;
  }
  playerrorSound() {
    const audio = new Audio();
    audio.src = 'assets/sounds/error.mp3';
    audio.load();
    audio.play();
    audio.volume = 1;
  }
  





}
