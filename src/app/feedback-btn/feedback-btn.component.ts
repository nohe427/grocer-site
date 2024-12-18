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

  @Input() traceId: string = ""
  @Input() spanId: string = "";
  @Input() flowName: string = "";

  show = false;

  openDialog(e: Event) {
    e.preventDefault();
    console.log("test")
    const feedbackDialogEl = this.feedbackDialog?.nativeElement;
    console.log(this.feedbackDialog);
    if (feedbackDialogEl) {
      console.log(feedbackDialogEl.open)
      feedbackDialogEl.show();
    }

  }
}
