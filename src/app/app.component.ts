import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from './components/pages/auth-page/auth-page.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthPageComponent, RouterModule],
  templateUrl: './app.component.html',
  host: {
    class: 'app-root-component'
  }
})
export class AppComponent {

}
