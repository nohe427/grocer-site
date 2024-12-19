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

  show = true;

  // // Uncomment this to open the popover by default to work on styling
  // ngAfterViewInit() {
  //   this.feedbackDialog?.nativeElement.showPopover();
  // }
}
