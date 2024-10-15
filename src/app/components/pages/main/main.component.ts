import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthState } from 'src/app/states/auth.state';
import { IAccount } from 'src/app/models/account.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ITokens } from 'src/app/models/tokens.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  public account: IAccount;

  constructor(private authState: AuthState, private authService: AuthService, private router: Router) {
    this.account = this.authState.getCurrentAccount();
  }

  public logout(): void {
    this.authState.logout();
    this.router.navigate(['/auth']);
  }

  public refreshTokens(): void {
    this.authService.refreshTokens(this.account.tokens.refreshToken).subscribe({
      next: (tokens: ITokens) => {
        this.authState.refreshTokens(tokens);
        this.account = this.authState.getCurrentAccount();
      }
    });
  }
}
