import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteConfigState } from 'src/app/states/site-config.state';
import { RegisterService } from 'src/app/services/register.service';
import { IAccountAuth } from 'src/app/models/account-auth.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-form-basic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form-basic.component.html',
  host: {
    class: 'register-form-basic'
  }
})

export class RegisterFormBasicComponent {

  // Событие для перехода на следующий этап регистрации.
  @Output() incrementStage: EventEmitter<void> = new EventEmitter<void>();

  // Форма для ввода основных данных пользователя.
  public registerBasicForm!: FormGroup;

  constructor(
    private siteConfigState: SiteConfigState,
    private registerService: RegisterService,
    private formBuilder: FormBuilder
  ) {
    // Инициализирует форму, передавая сохранённые данные аккаунта.
    this.initRegisterBasicForm(this.registerService.currentRegistrationAccount$.value);
  }

  // Метод для инициализации формы с основными данными пользователя.
  private initRegisterBasicForm(savedAccount: IAccountAuth | null): void {
    this.registerBasicForm = this.formBuilder.group({
      login: new FormControl<string | null>(
        savedAccount?.login ? savedAccount.login : "",
        [
          Validators.required,
          Validators.minLength(this.siteConfigState.MIN_LENGHT_LOGIN),
          Validators.maxLength(this.siteConfigState.MAX_LENGHT_LOGIN),
        ],
      ),
      email: new FormControl<string | null>(
        savedAccount?.email ? savedAccount.email : "",
        [
          Validators.required,
          Validators.email
        ],
      ),
      name: new FormControl<string | null>(
        savedAccount?.name ? savedAccount.name : "",
        [
          Validators.required
        ]
      ),
      surname: new FormControl<string | null>(
        savedAccount?.surname ? savedAccount.surname : "",
        [
          Validators.required
        ]
      ),
      city: new FormControl<string | null>(
        savedAccount?.city ? savedAccount.city : "",
        [
          Validators.required
        ]
      ),
      age: new FormControl<number | null>(
        savedAccount?.age ? savedAccount.age : null,
        [
          Validators.required
        ]
      ),
      password: new FormControl<string | null>(
        savedAccount?.password ? savedAccount.password : "",
        [
          Validators.required,
          Validators.pattern(this.siteConfigState.REGEXP)
        ]
      )
    });
  }

  // Метод для отправки формы с основными данными.
  public submitRegisterBasicForm(): void {
    // Проверяет, валидна ли форма.
    if (this.registerBasicForm.valid) {
      // Получает значения из формы.
      const formValue = this.registerBasicForm.value;
      const account: IAccountAuth = {
        login: formValue.login,
        email: formValue.email,
        name: formValue.name,
        surname: formValue.surname,
        city: formValue.city,
        age: formValue.age,
        password: formValue.password
      };
      // Обновляет аккаунт с новыми данными.
      this.registerService.updateRegistrationAccount(account);
      // Переходит к следующему этапу.
      this.incrementStage.emit();
    }
  }

  // Геттер для получения контроля логина из формы.
  public get login(): AbstractControl | null {
    return this.registerBasicForm.get("login");
  }

  // Геттер для получения контроля email из формы.
  public get email(): AbstractControl | null {
    return this.registerBasicForm.get("email");
  }

  // Геттер для получения контроля имени из формы.
  public get name(): AbstractControl | null {
    return this.registerBasicForm.get("name");
  }

  // Геттер для получения контроля фамилии из формы.
  public get surname(): AbstractControl | null {
    return this.registerBasicForm.get("surname");
  }

  // Геттер для получения контроля пароля из формы.
  public get password(): AbstractControl | null {
    return this.registerBasicForm.get("password");
  }

  // Геттер для получения контроля города из формы.
  public get city(): AbstractControl | null {
    return this.registerBasicForm.get("city");
  }

  // Геттер для получения контроля возраста из формы.
  public get age(): AbstractControl | null {
    return this.registerBasicForm.get("age");
  }
}

