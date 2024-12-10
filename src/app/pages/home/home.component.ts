import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExternalLinkDirective } from '../../directives/external-link.directive';
import { ArrowBoxIconComponent } from '../../components/icons/arrow-box-icon.component';
import { GithubIconComponent } from '../../components/icons/github-icon.component';
import { TwitterIconComponent } from '../../components/icons/twitter-icon.component';
import { YouTubeIconComponent } from '../../components/icons/youtube-icon.component';
import { ImageInputComponent } from '../../image-input/image-input.component';

const icons = [ArrowBoxIconComponent, GithubIconComponent, TwitterIconComponent, YouTubeIconComponent];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ExternalLinkDirective, ...icons, ImageInputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: {
    'class': 'content'
  }
})
export class HomeComponent {
  async submitPrompt(event: Event, promptImage: HTMLInputElement, promptText: HTMLTextAreaElement) {
    event.preventDefault();
    const prompt: {text?: string, image?: ArrayBuffer} = {};

    if (promptText.value) {
      prompt.text = promptText.value;
    }

    if (promptImage.value && promptImage.files?.length === 1) {
      const file = promptImage.files[0];
      prompt.image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.onerror = (err) => {
          reject(err);
        };
      });
    }

    const response = await fetch('api/helloWorld', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(prompt)
    });

    console.log(response.ok, response.body);
    
    console.log(promptImage.files, promptText.value, JSON.stringify(promptImage));
  }
}
