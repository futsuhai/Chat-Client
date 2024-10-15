import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  host: {
    class: 'stepper-component'
  }
})

export class StepperComponent implements OnChanges {

  // Текущий этап, принимаемый через входной параметр.
  @Input() currentStage: number = 1;

  // Массив, который хранит состояние активных шагов (true - активен, false - неактивен).
  public activeSteps: boolean[] = [true, false, false];

  // Метод, который вызывается при изменении входных параметров.
  public ngOnChanges(changes: SimpleChanges): void {
    // Проверяет, были ли изменения в currentStage и не является ли это первым изменением.
    if (changes['currentStage'] && !changes['currentStage'].firstChange) {
      // Заполняет массив activeSteps значениями false, устанавливая все шаги неактивными.
      this.activeSteps.fill(false);

      // Устанавливает активные шаги до текущего этапа.
      for (let i = 0; i < this.currentStage; i++) {
        this.activeSteps[i] = true;
      }
    }
  }

  // Метод для проверки, является ли указанный шаг активным.
  public isStepActive(step: number): boolean {
    // Возвращает true, если текущий этап равен шагу или если шаг активен в массиве activeSteps.
    return this.currentStage === step || this.activeSteps[step - 1];
  }
}

