import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'app-feedback-btn',
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

    if(!this.yesRadio?.nativeElement.checked && !this.noRadio?.nativeElement.checked) {
      console.error('gotta check something');
      return;
    }

    const feedbackResponse = { data: {
      traceId: this.traceId,
      spanId: this.spanId,
      name: this.flowName,
      feedback: {
        value: this.yesRadio?.nativeElement.checked ? "positive" : "negative",
        text: this.freeFromInputBox?.nativeElement.value || ""
      },
      acceptance: {
        value: "accepted",
      },
    }}

    // TODO(nohe): send this somewhere...
    fetch('https://genkit-inst-1039410413539.us-central1.run.app/feedback',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackResponse),
      }
  )
    this.feedbackDialog?.nativeElement.hidePopover();
  }
}
