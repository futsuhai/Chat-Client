import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAccountAuth } from '../models/account-auth.model';

@Injectable({
  providedIn: 'root'
})

// Сервис для хранения текущей сессии регистрации.
export class RegisterService {

  // BehaviorSubject для хранения текущего аккаунта регистрации.
  public currentRegistrationAccount$ = new BehaviorSubject<IAccountAuth | null>(null);

  // Метод для обновления информации о текущем аккаунте.
  public updateRegistrationAccount(updates: IAccountAuth): void {
    // Получаем текущее значение аккаунта.
    const currentAccount = this.currentRegistrationAccount$.value;

    // Создаём новый объект аккаунта, объединяя старые и новые данные.
    const updatedAccount: IAccountAuth = { ...currentAccount, ...updates };

    // Обновляем значение BehaviorSubject с новым аккаунтом.
    this.currentRegistrationAccount$.next(updatedAccount);
  }
}
