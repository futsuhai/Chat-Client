import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../logo/logo.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { IAccountAuth } from 'src/app/models/account-auth.model';
import { IAccount } from 'src/app/models/account.model';
import { Router } from '@angular/router';
import { AuthState } from 'src/app/states/auth.state';
import { Subject } from 'rxjs';
import { SiteConfigState } from 'src/app/states/site-config.state';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, LogoComponent, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  host: {
    class: 'login-form-component'
  }
})
export class LoginFormComponent implements OnDestroy {
  // Событие для переключения форм (например, с логина на регистрацию).
  @Output() switchedForm: EventEmitter<void> = new EventEmitter<void>();

  // Форма для ввода логина и пароля.
  public loginForm: FormGroup;

  // Subject для управления подписками и их отмены при уничтожении компонента.
  private unsubscribe$ = new Subject<void>();

  // Конструктор, который инициализирует форму и принимает зависимости.
  constructor(
    // Состояние конфигурации сайта.
    private siteConfigState: SiteConfigState,

    // Сервис аутентификации для выполнения запросов.
    private authService: AuthService,

    // Сервис для навигации.
    private router: Router,

    // Состояние аутентификации для управления текущим аккаунтом.
    private authState: AuthState
  ) {
    // Инициализирует форму.
    this.loginForm = this.initLoginForm();
  }

  // Метод для создания и настройки формы логина.
  private initLoginForm(): FormGroup {
    return new FormGroup({
      // Контрол для логина с валидацией.
      login: new FormControl<string | null>(
        "",
        [
          Validators.required,
          Validators.minLength(this.siteConfigState.MIN_LENGHT_LOGIN),
          Validators.maxLength(this.siteConfigState.MAX_LENGHT_LOGIN)
        ]
      ),
      // Контрол для пароля с валидацией.
      password: new FormControl<string | null>(
        "",
        [
          Validators.required,
          Validators.pattern(this.siteConfigState.REGEXP)
        ]
      ),
      // Контрол для запоминания пользователя.
      // Поле для запоминания (по умолчанию - false).
      remember: new FormControl<boolean | null>(false)
    });
  }

  // Метод для обработки отправки формы логина.
  public submitLoginForm(): void {
    // Проверяет, валидна ли форма.
    if (this.loginForm.valid) {
      // Получает значения из формы.
      const formValue = this.loginForm.value;
      const account: IAccountAuth = {
        // Логин пользователя.
        login: formValue.login,

        // Пароль пользователя.
        password: formValue.password
      };
      // Выполняет вход, подписываясь на результат.
      this.authService.login(account).subscribe({
        // Успешный ответ от сервиса.
        next: (account: IAccount) => {
          // Устанавливает текущий аккаунт.
          this.authState.setCurrentAccount(account);

          // Перенаправляет на главную страницу.
          this.router.navigate(['/main']);
        },
        // Обработка ошибки при входе.
        error: () => {
          // Устанавливает ошибку для логина.
          this.login?.setErrors({ unauthorized: true });

          // Устанавливает ошибку для пароля.
          this.password?.setErrors({ unauthorized: true });
        }
      });
    }
  }

  // Метод для переключения на другую форму (например, регистрацию).
  public switchForm(): void {
    // Генерирует событие переключения формы.
    this.switchedForm.emit();
  }

  // Геттер для доступа к контролу логина.
  public get login(): AbstractControl | null {
    return this.loginForm.get("login");
  }

  // Геттер для доступа к контролу пароля.
  public get password(): AbstractControl | null {
    return this.loginForm.get("password");
  }

  // Геттер для доступа к контролу запоминания.
  public get remember(): AbstractControl | null {
    return this.loginForm.get("remember");
  }

  // Метод, вызываемый при уничтожении компонента для очистки ресурсов.
  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

