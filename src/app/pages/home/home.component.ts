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
    const formData = new FormData();

    if (promptText.value) {
      formData.append('query', promptText.value)
    }

    if (promptImage.value && promptImage.files?.length === 1) {
      formData.append('promptImage', promptImage.files[0])
    }

    const response = await fetch('api/helloWorld', {
      method: 'POST',
      body: formData
    })

    console.log(response.ok, response.body);
    
    console.log(promptImage.files, promptText.value, JSON.stringify(promptImage));
  }
}
