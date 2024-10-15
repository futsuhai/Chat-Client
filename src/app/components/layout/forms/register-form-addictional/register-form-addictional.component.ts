import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { IAccountAuth } from 'src/app/models/account-auth.model';

@Component({
  selector: 'app-register-form-addictional',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form-addictional.component.html',
  host: {
    class: 'register-form-addictional'
  }
})

export class RegisterFormAddictionalComponent {

  // Событие для перехода на следующий этап регистрации.
  @Output() incrementStage: EventEmitter<void> = new EventEmitter<void>();

  // Событие для перехода на предыдущий этап регистрации.
  @Output() decrementStage: EventEmitter<void> = new EventEmitter<void>();

  // Форма для ввода дополнительной информации о пользователе.
  public registerAddictionalForm: FormGroup;

  // Сохраненный пользователь для заполнения формы, если данные доступны.
  public savedUser!: IAccountAuth;

  constructor(private registerService: RegisterService) {
    // Проверка, есть ли уже зарегистрированный аккаунт.
    if (this.registerService.currentRegistrationAccount$.value !== null) {
      // Получает сохранённые данные пользователя.
      this.savedUser = this.registerService.currentRegistrationAccount$.value;

      // Инициализирует форму с сохранёнными данными.
      this.registerAddictionalForm = this.initSavedRegisterAddictionalForm();
    } else {
      // Инициализирует пустую форму.
      this.registerAddictionalForm = this.initRegisterAddictionalForm();
    }
  }

  // Метод для инициализации формы для нового пользователя.
  private initRegisterAddictionalForm(): FormGroup {
    return new FormGroup({
      bio: new FormControl<string | null>(""),
      url1: new FormControl<string | null>(""),
      url2: new FormControl<string | null>(""),
      url3: new FormControl<string | null>("")
    });
  }

  // Метод для инициализации формы с сохранёнными данными пользователя.
  private initSavedRegisterAddictionalForm(): FormGroup {
    // Проверяет, есть ли сохраненные URL-адреса социальных медиа.
    if (this.savedUser && this.savedUser.socialMediaUrls) {
      return new FormGroup({
        bio: new FormControl<string | null>(this.savedUser.bio || ""),
        url1: new FormControl<string | null>(this.savedUser.socialMediaUrls[0] || ""),
        url2: new FormControl<string | null>(this.savedUser.socialMediaUrls[1] || ""),
        url3: new FormControl<string | null>(this.savedUser.socialMediaUrls[2] || "")
      });
    } else {
      // Возвращает пустую форму, если нет сохранённых данных.
      return this.initRegisterAddictionalForm();
    }
  }

  // Метод для отправки формы с дополнительной информацией.
  public submitRegisterAddictionalForm(): void {
    // Проверяет, валидна ли форма.
    if (this.registerAddictionalForm.valid) {
      // Получает значения из формы.
      const formValue = this.registerAddictionalForm.value;
      const socialMediaUrls = [
        formValue.url1,
        formValue.url2,
        formValue.url3
      ];
      const user: IAccountAuth = {
        bio: formValue.bio,
        socialMediaUrls: socialMediaUrls
      };
      // Обновляет аккаунт с новыми данными.
      this.registerService.updateRegistrationAccount(user);
      // Переходит к следующему этапу.
      this.incrementStage.emit();
    }
  }

  // Метод для возврата на предыдущий этап регистрации.
  public backToPreviousStage(): void {
    // Генерирует событие возврата на предыдущий этап.
    this.decrementStage.emit();
  }
}

