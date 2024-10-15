import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../logo/logo.component';
import { StepperComponent } from '../../stepper/stepper.component';
import { RegisterFormBasicComponent } from '../register-form-basic/register-form-basic.component';
import { RegisterFormAddictionalComponent } from '../register-form-addictional/register-form-addictional.component';
import { RegisterFormSpecComponent } from '../register-form-spec/register-form-spec.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterService } from 'src/app/services/register.service';
import { IAccountAuth } from 'src/app/models/account-auth.model';
import { IAccount } from 'src/app/models/account.model';
import { AuthState } from 'src/app/states/auth.state';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports:
    [
      CommonModule, LogoComponent, StepperComponent,
      RegisterFormBasicComponent, RegisterFormAddictionalComponent,
      RegisterFormSpecComponent
    ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  host: {
    class: 'register-form-component'
  }
})

export class RegisterFormComponent implements OnDestroy {

  // Событие для переключения форм.
  @Output() switchedForm: EventEmitter<void> = new EventEmitter<void>();

  // Текущий этап регистрации.
  public currentStage: number = 1;

  // Зарегистрированный аккаунт.
  public registeredAccount!: IAccountAuth;

  // Subject для управления подписками и их отмены при уничтожении компонента.
  private unsubscribe$ = new Subject<void>();

  constructor(
    // Сервис для навигации.
    private router: Router,

    // Сервис аутентификации для выполнения запросов.
    private authService: AuthService,

    // Сервис для управления регистрацией.
    private registerService: RegisterService,

    // Состояние аутентификации для управления текущим аккаунтом.
    private authState: AuthState
  ) {
    // Подписка на изменения текущего аккаунта регистрации.
    this.registerService.currentRegistrationAccount$.subscribe({
      next: (account: IAccountAuth | null) => {
        if (account) {
          // Устанавливает зарегистрированный аккаунт.
          this.registeredAccount = account;
        }
      }
    });
  }

  // Метод для переключения на другую форму (например, с регистрации на вход).
  public switchForm(): void {
    // Генерирует событие переключения формы.
    this.switchedForm.emit();
  }

  // Метод для перехода на следующий этап регистрации.
  public incrementStage(): void {
    // Проверяет, достигнут ли третий этап.
    if (this.currentStage === 3) {
      this.authService.register(this.registeredAccount).subscribe({
        next: (account: IAccount) => {
          // Устанавливает текущий аккаунт.
          this.authState.setCurrentAccount(account);

          // Перенаправляет на главную страницу.
          this.router.navigate(['/main']);
        }
      });
    }
    // Увеличивает текущий этап.
    this.currentStage++;
  }

  // Метод для перехода на предыдущий этап регистрации.
  public decrementStage(): void {
    // Уменьшает текущий этап.
    this.currentStage--;
  }

  // Метод, вызываемый при уничтожении компонента для очистки ресурсов.
  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
