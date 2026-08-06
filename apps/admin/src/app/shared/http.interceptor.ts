import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, REQUEST } from '@angular/core';
import { environment } from '../../environments/environment';

export const httpInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const request = inject(REQUEST, { optional: true });
  const apiUrl = request && environment.apiUrl.startsWith('/')
    ? new URL(environment.apiUrl, request.url).toString().replace(/\/$/, '')
    : environment.apiUrl.replace(/\/$/, '');
  let newReq: HttpRequest<unknown> = req.clone({
    url: `${apiUrl}${req.url.startsWith('/') ? req.url : `/${req.url}`}`,
    withCredentials: true
  });

  const cookie = request?.headers.get('cookie');
  if (cookie) {
    newReq = newReq.clone({ setHeaders: { Cookie: cookie } });
  }

  return next(newReq);
};
