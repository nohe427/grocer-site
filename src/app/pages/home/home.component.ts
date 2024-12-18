import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExternalLinkDirective } from '../../directives/external-link.directive';
import { FeedbackBtnComponent } from '../../feedback-btn/feedback-btn.component';
import { ArrowBoxIconComponent } from '../../components/icons/arrow-box-icon.component';
import { GithubIconComponent } from '../../components/icons/github-icon.component';
import { TwitterIconComponent } from '../../components/icons/twitter-icon.component';
import { YouTubeIconComponent } from '../../components/icons/youtube-icon.component';
import { ImageInputComponent } from '../../image-input/image-input.component';
import { MarkdownModule } from 'ngx-markdown';
import { NgClass } from '@angular/common';
const icons = [ArrowBoxIconComponent, GithubIconComponent, TwitterIconComponent, YouTubeIconComponent];

const CUSTOMER_AGENT_FLOW = "customerAgent";

interface UlDlJs {
  uploadLocation: string,
  downloadLocation: string,
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, MarkdownModule, RouterLink, ExternalLinkDirective, ...icons, ImageInputComponent, FeedbackBtnComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: {
    'class': 'content'
  }
})
export class HomeComponent {
  readonly flow = CUSTOMER_AGENT_FLOW;
  result = "";
  status = "";
  buttonPrompt = `Let's cook!`
  traceId = "";
  spanId = "";

  async submitPrompt(event: Event, promptImage: HTMLInputElement, promptText: HTMLTextAreaElement) {
    event.preventDefault();
    this.status = 'loading';
    this.buttonPrompt = `Cooking...`;

    const prompt: { data: { text?: string, image?: string } } = { data: { text: "", image: "" } };

    if (promptText.value) {
      prompt.data.text = promptText.value.trim();
    }

    if (promptImage.value && promptImage.files?.length === 1) {
      const fileMimeType = promptImage.files[0].type
      // Upload to bucket
      const getUploadUrl = await fetch('https://us-central1-lon-next.cloudfunctions.net/UploadImgTrip', {
        method: 'GET',
        headers: { 'mime': fileMimeType }
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

    try {
      const response = await fetch(
        `https://genkit-inst-1039410413539.us-central1.run.app/${CUSTOMER_AGENT_FLOW}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prompt),
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      console.log(response.headers)

      const responseSpanId = response.headers.get("x-genkit-span-id");
      response.headers.forEach((k, v) => { console.log(k, v) })
      if (responseSpanId) {
        console.log(responseSpanId);
        this.spanId = responseSpanId;
      }

      const responseTraceId = response.headers.get("x-genkit-trace-id");
      if (responseTraceId) {
        this.traceId = responseTraceId;
      }

      const json = await response.json();
      this.result = json.result;
      this.status = "";
      this.buttonPrompt = `Let's cook!`;
    } catch (e) {
      this.result = (e as Error).message;
      this.status = "";
      this.buttonPrompt = "Try again";
    }
  }
}
