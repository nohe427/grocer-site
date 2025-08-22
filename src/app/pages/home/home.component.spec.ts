import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { CustomerAgentService } from '../../service/customer-agent.service';
import { UploadImgService } from '../../service/upload-img.service';
import { MarkdownModule } from 'ngx-markdown';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let customerAgentService: CustomerAgentService;
  let uploadImgService: UploadImgService;

  const mockCustomerAgentService = {
    askAgent: jest.fn(),
  };

  const mockUploadImgService = {
    uploadImg: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, MarkdownModule.forRoot()],
      providers: [
        { provide: CustomerAgentService, useValue: mockCustomerAgentService },
        { provide: UploadImgService, useValue: mockUploadImgService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    customerAgentService = TestBed.inject(CustomerAgentService);
    uploadImgService = TestBed.inject(UploadImgService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call askAgent on submitPrompt', async () => {
    const text = 'test prompt';
    const result = { result: 'test result', traceId: '123', spanId: '456' };
    mockCustomerAgentService.askAgent.mockResolvedValue(result);
    const mockEvent = { preventDefault: () => {} } as Event;
    const mockImageInput = { value: '', files: [] as any } as HTMLInputElement;
    const mockTextArea = { value: text } as HTMLTextAreaElement;

    await component.submitPrompt(mockEvent, mockImageInput, mockTextArea);

    expect(customerAgentService.askAgent).toHaveBeenCalledWith(text, '');
    expect(component.result).toBe(result.result);
    expect(component.traceId).toBe(result.traceId);
    expect(component.spanId).toBe(result.spanId);
  });

  it('should call uploadImg and askAgent on submitPrompt with image', async () => {
    const text = 'test prompt';
    const imageUrl = 'http://example.com/image.png';
    const result = { result: 'test result', traceId: '123', spanId: '456' };
    const uploadResult = { downloadLocation: imageUrl };
    mockCustomerAgentService.askAgent.mockResolvedValue(result);
    mockUploadImgService.uploadImg.mockResolvedValue(uploadResult);
    const mockEvent = { preventDefault: () => {} } as Event;
    const mockImageInput = { value: 'test.png', files: [new File([], 'test.png', { type: 'image/png' })] } as unknown as HTMLInputElement;
    const mockTextArea = { value: text } as HTMLTextAreaElement;

    await component.submitPrompt(mockEvent, mockImageInput, mockTextArea);

    expect(uploadImgService.uploadImg).toHaveBeenCalled();
    expect(customerAgentService.askAgent).toHaveBeenCalledWith(text, imageUrl);
    expect(component.result).toBe(result.result);
    expect(component.traceId).toBe(result.traceId);
    expect(component.spanId).toBe(result.spanId);
  });
});
