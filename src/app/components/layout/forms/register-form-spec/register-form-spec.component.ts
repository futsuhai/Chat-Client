import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SiteConfigState } from 'src/app/states/site-config.state';
import { RegisterService } from 'src/app/services/register.service';
import { IAccountAuth } from 'src/app/models/account-auth.model';

@Component({
  selector: 'app-register-form-spec',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form-spec.component.html',
  styleUrls: ['./register-form-spec.component.scss'],
  host: {
    class: 'register-form-spec'
  }
})

export class RegisterFormSpecComponent {

  // Событие для перехода на следующий этап регистрации.
  @Output() incrementStage: EventEmitter<void> = new EventEmitter<void>();

  // Событие для возврата на предыдущий этап регистрации.
  @Output() decrementStage: EventEmitter<void> = new EventEmitter<void>();

  // Форма для ввода специальностей пользователя.
  public registerSpecForm: FormGroup;

  // Массив специальностей.
  public specializations: string[] = [];

  // Сохранённые данные пользователя.
  public savedUser!: IAccountAuth;

  constructor(private siteConfigState: SiteConfigState, private registerService: RegisterService, private fb: FormBuilder) {
    // Получает список специальностей из состояния конфигурации сайта.
    this.specializations = this.siteConfigState.Specializations;

    // Проверяет, есть ли сохранённый аккаунт, и инициализирует форму.
    if (this.registerService.currentRegistrationAccount$.value !== null) {
      this.savedUser = this.registerService.currentRegistrationAccount$.value;
      // Инициализирует форму с сохранёнными данными.
      this.registerSpecForm = this.initSavedRegisterSpecForm();
    } else {
      // Инициализирует пустую форму.
      this.registerSpecForm = this.initRegisterSpecForm();
    }
  }

  // Метод для инициализации формы для новых пользователей.
  private initRegisterSpecForm(): FormGroup {
    const formGroup = this.fb.group({});
    // Добавляет контролы для каждой специальности.
    this.specializations.forEach((index) => {
      // Устанавливает значение по умолчанию false.
      formGroup.addControl(`spec${index + 1}`, new FormControl(false));
    });
    return formGroup;
  }

  // Метод для инициализации формы с сохранёнными данными пользователя.
  private initSavedRegisterSpecForm(): FormGroup {
    const formGroup = this.fb.group({});
    // Заполняет контролы значениями из сохранённого аккаунта.
    this.specializations.forEach((spec, index) => {
      // Проверяет, выбрана ли специальность.
      const isChecked = this.savedUser.specializations?.includes(spec) || false;
      // Устанавливает значение по умолчанию.
      formGroup.addControl(`spec${index + 1}`, new FormControl(isChecked));
    });
    return formGroup; // Возвращает группу контролов.
  }

  // Метод для отправки формы со специальностями.
  public submitRegisterSpecForm(): void {
    // Проверяет, валидна ли форма.
    if (this.registerSpecForm.valid) {
      // Получает значения из формы.
      const formValue = this.registerSpecForm.value;
      const specArray: string[] = [];
      // Заполняет массив специальностей, которые были выбраны.
      this.specializations.forEach((spec, index) => {
        if (formValue[`spec${index + 1}`]) {
          // Добавляет специальность в массив, если она выбрана.
          specArray.push(this.specializations[index]);
        }
      });
      const user: IAccountAuth = {
        // Создаёт объект пользователя с выбранными специальностями.
        specializations: specArray
      };
      // Обновляет аккаунт с новыми данными.
      this.registerService.updateRegistrationAccount(user);
      // Переходит к следующему этапу.
      this.incrementStage.emit();
    }
  }

  // Метод для возврата на предыдущий этап.
  public backToPreviousStage(): void {
    // Проверяет, валидна ли форма.
    if (this.registerSpecForm.valid) {
      // Получает значения из формы.
      const formValue = this.registerSpecForm.value;
      const specArray: string[] = [];
      // Заполняет массив специальностей, которые были выбраны.
      this.specializations.forEach((spec, index) => {
        if (formValue[`spec${index + 1}`]) {
          // Добавляет специальность в массив, если она выбрана.
          specArray.push(this.specializations[index]);
        }
      });
      const user: IAccountAuth = {
        // Создаёт объект пользователя с выбранными специальностями.
        specializations: specArray
      };
      // Обновляет аккаунт с новыми данными.
      this.registerService.updateRegistrationAccount(user);
    }
    // Возвращается на предыдущий этап.
    this.decrementStage.emit();
  }
}

