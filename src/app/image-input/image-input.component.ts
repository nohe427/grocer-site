import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss'
})
export class ImageInputComponent {
  selectedFile = '';
  img?: string|ArrayBuffer|null;

  onFileSelected(event: Event) {
    const inputEl = (event.target as HTMLInputElement)
    if (inputEl.files && inputEl.files.length) {
      const file = inputEl.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        if (event.target) {
          this.selectedFile = file.name;
          this.img = event.target.result;
        }
      });
      reader.readAsDataURL(file);
    }
  }
}
