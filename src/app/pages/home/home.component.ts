import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExternalLinkDirective } from '../../directives/external-link.directive';
import { FeedbackBtnComponent } from '../../feedback-btn/feedback-btn.component';
import { ArrowBoxIconComponent } from '../../components/icons/arrow-box-icon.component';
import { GithubIconComponent } from '../../components/icons/github-icon.component';
import { TwitterIconComponent } from '../../components/icons/twitter-icon.component';
import { YouTubeIconComponent } from '../../components/icons/youtube-icon.component';
import { ImageInputComponent } from '../../image-input/image-input.component';
import { MarkdownModule } from 'ngx-markdown';
import { CustomerAgentService } from '../../service/customer-agent.service';
import { UploadImgService, UlDlJs } from '../../service/upload-img.service';
import { NgClass } from '@angular/common';
const icons = [ArrowBoxIconComponent, GithubIconComponent, TwitterIconComponent, YouTubeIconComponent];

const CUSTOMER_AGENT_FLOW = "customerAgent";



@Component({
    selector: 'app-home',
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

  constructor(private customerAgentService: CustomerAgentService, private uploadImgService: UploadImgService) {
  }

  async submitPrompt(event: Event, promptImage: HTMLInputElement, promptText: HTMLTextAreaElement) {
    event.preventDefault();
    this.status = 'loading';
    this.buttonPrompt = `Cooking...`;

    const prompt: { data: { text?: string, image?: string } } = { data: { text: "", image: "" } };

    if (promptText.value) {
      prompt.data.text = promptText.value.trim();
    }

    if (promptImage.value && promptImage.files?.length === 1) {
      const uploadImg = await this.uploadImgService.uploadImg(promptImage.files[0].type, promptImage.files[0]);
      prompt.data.image = uploadImg.downloadLocation;
    }

    const result = this.customerAgentService.askAgent(prompt.data.text, prompt.data.image);

    this.result = (await result).result
    this.status = "";
    this.buttonPrompt = `Let's cook!`;
  }
}
