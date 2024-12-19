import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-feedback-btn',
  standalone: true,
  imports: [],
  templateUrl: './feedback-btn.component.html',
  styleUrl: './feedback-btn.component.scss'
})
export class FeedbackBtnComponent {
  @ViewChild('feedbackDialog') feedbackDialog?: ElementRef<HTMLDialogElement>;
  @ViewChild('noRadio') noRadio?: ElementRef<HTMLInputElement>;
  @ViewChild('yesRadio') yesRadio?: ElementRef<HTMLInputElement>;
  @ViewChild('freeFromInputBox') freeFromInputBox?: ElementRef<HTMLTextAreaElement>;
  
  @Input() traceId: string = ""
  @Input() spanId: string = "";
  @Input() flowName: string = "";

  show = true;

  submitFeedback(event: Event) {
    event.preventDefault();

    const feedbackResponse = {
      traceId: this.traceId,
      spanId: this.spanId,
      flowName: this.flowName,
      helpful: this.yesRadio?.nativeElement.checked || false,
      freeInput: this.freeFromInputBox?.nativeElement.value || ""
    }

    // TODO(nohe): send this somewhere...
    console.log(feedbackResponse);
  }
}
