import { Component } from '@angular/core';

@Component({
    selector: 'app-sign-in-btn',
    imports: [],
    templateUrl: './sign-in-btn.component.html',
    styleUrl: './sign-in-btn.component.scss'
})
export class SignInBtnComponent {

signIn() {
    console.log('sign in button clicked!');
}

}
