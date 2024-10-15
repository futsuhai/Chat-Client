import { Routes } from "@angular/router";
import { AuthPageComponent } from "../components/pages/auth-page/auth-page.component";
import { NotFoundPageComponent } from "../components/pages/not-found-page/not-found-page.component";
import { MainComponent } from "../components/pages/main/main.component";

export const APP_ROUTES: Routes = [
    {
        path: '',
        title: 'auth',
        component: AuthPageComponent
    },
    {
        path: 'auth',
        title: 'Auth',
        component: AuthPageComponent
    },
    {
        path: 'main',
        title: 'Quick Talk',
        component: MainComponent
    },
    {
        path: '**',
        component: NotFoundPageComponent
    }
];