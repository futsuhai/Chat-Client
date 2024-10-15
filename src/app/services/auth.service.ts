import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable } from 'rxjs';
import { IAccountAuth } from '../models/account-auth.model';
import { IAccount } from '../models/account.model';
import { ITokens } from '../models/tokens.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Геттер для получения базового URL API аутентификации.
  get api(): string {
    return `/api/auth`;
  }

  // Конструктор, принимающий RestService для выполнения HTTP-запросов.
  constructor(private restService: RestService) { }

  // Метод для регистрации нового аккаунта, возвращает Observable с IAccount.
  public register(account: IAccountAuth): Observable<IAccount> {
    const endpoint: string = `${this.api}/Register`;
    return this.restService.restPOST<IAccount>(endpoint, account);
  }

  // Метод для входа в систему, возвращает Observable с IAccount.
  public login(account: IAccountAuth): Observable<IAccount> {
    const endpoint: string = `${this.api}/Auth`;
    return this.restService.restPUT<IAccount>(endpoint, account);
  }

  // Метод для обновления токенов, возвращает Observable с ITokens.
  public refreshTokens(refreshToken: string): Observable<ITokens> {
    const endpoint: string = `${this.api}/RefreshTokens/${refreshToken}`;
    return this.restService.restPUT<ITokens>(endpoint);
  }
}
