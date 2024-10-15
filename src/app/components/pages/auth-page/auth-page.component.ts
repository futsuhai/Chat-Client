import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../layout/forms/login-form/login-form.component';
import { RegisterFormComponent } from '../../layout/forms/register-form/register-form.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  host: {
    class: 'auth-page-component'
  }
})
export class AuthPageComponent {

  public formSwitched: boolean = false;

  public switchForm(): void {
    this.formSwitched = !this.formSwitched;
  }
}
