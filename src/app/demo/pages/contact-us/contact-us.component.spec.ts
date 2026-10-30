import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ContactUsComponent } from './contact-us.component';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/api/v1/contact`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    component = TestBed.runInInjectionContext(() => new ContactUsComponent());
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  function fillForm() {
    component.form.setValue({ firstName: ' Anna ', lastName: ' Test ', email: 'anna@example.com', phone: '+30 210 1234567', message: ' Hello ', privacyAccepted: true });
  }

  it('requires valid fields and explicit consent', () => {
    component.submit();
    http.expectNone(url);
    fillForm();
    component.form.patchValue({ firstName: '   ', email: 'bad', privacyAccepted: false });
    component.submit();
    expect(component.form.invalid).toBeTrue();
    http.expectNone(url);
  });

  it('posts once and resets consent after a 204', () => {
    fillForm();
    component.submit();
    component.submit();
    const request = http.expectOne(url);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ firstName: 'Anna', lastName: 'Test', email: 'anna@example.com', phone: '+30 210 1234567', message: 'Hello', privacyAccepted: true });
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(component.success).toBeTrue();
    expect(component.loading).toBeFalse();
    component.reset();
    expect(component.form.controls.privacyAccepted.value).toBeFalse();
    expect(component.form.controls.firstName.value).toBe('');
    expect(component.success).toBeFalse();
  });

  it('keeps the form and shows a generic error on failure', () => {
    fillForm();
    component.submit();
    http.expectOne(url).flush({ message: 'internal details' }, { status: 500, statusText: 'Error' });
    expect(component.error).toBeTrue();
    expect(component.success).toBeFalse();
    expect(component.loading).toBeFalse();
    expect(component.form.controls.message.value).toBe(' Hello ');
  });
});
