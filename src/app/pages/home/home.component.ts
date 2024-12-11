import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExternalLinkDirective } from '../../directives/external-link.directive';
import { ArrowBoxIconComponent } from '../../components/icons/arrow-box-icon.component';
import { GithubIconComponent } from '../../components/icons/github-icon.component';
import { TwitterIconComponent } from '../../components/icons/twitter-icon.component';
import { YouTubeIconComponent } from '../../components/icons/youtube-icon.component';
import { ImageInputComponent } from '../../image-input/image-input.component';

const icons = [ArrowBoxIconComponent, GithubIconComponent, TwitterIconComponent, YouTubeIconComponent];

interface UlDlJs {
  uploadLocation: string,
  downloadLocation: string,
}

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
  result = "";
  async submitPrompt(event: Event, promptImage: HTMLInputElement, promptText: HTMLTextAreaElement) {
    event.preventDefault();
    // const prompt: {text?: string, image?: ArrayBuffer} = {};
    const prompt: {data: {text?:string, image?: string}} = {data: {text:"", image: ""}};

    if (promptText.value) {
      prompt.data.text = promptText.value;
    }

    // TODO: Use a bucket to upload an image somewhere. @jhuleatt Help?
    if (promptImage.value && promptImage.files?.length === 1) {
      const fileMimeType = promptImage.files[0].type
        // Upload to bucket
      const getUploadUrl = await fetch('https://us-central1-lon-next.cloudfunctions.net/UploadImgTrip', {
        method: 'GET',
        headers: {'mime': fileMimeType}
      });
      const uploadJson: UlDlJs = await getUploadUrl.json();
      var data = new FormData()
      data.append('file', (await promptImage.files[0]))
      const uploadImg = await fetch(uploadJson.uploadLocation, {
        method: 'PUT',
        body: promptImage.files[0],
      });
      prompt.data.image = uploadJson.downloadLocation;
    }

    //TODO(@jhuleatt): We needed to use an off app hosting server. Can explain tomorrow.
    const response = await fetch('https://genkit-inst-1039410413539.us-central1.run.app/customerAgent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(prompt)
    });

    // const response = await fetch('api/helloWorld', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(prompt)
    // });

    const json = await response.json();
    this.result = json['result'];

    console.log(response.ok, json);
    
    console.log(promptImage.files, promptText.value, JSON.stringify(promptImage));
  }
}
