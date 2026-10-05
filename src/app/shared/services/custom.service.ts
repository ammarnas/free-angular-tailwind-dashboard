import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SKIP_AUTH } from './auth/skip-auth.token';

// Thin wrapper around HttpClient — this class only builds the URL, params, and the per-request
// opt-out of authentication. Authorization/Accept-Language headers, the 401 refresh-retry flow,
// and error toasts/navigation are expected to live in an auth interceptor (not yet present in
// this project; register it with `withInterceptors([...])` in app.config.ts when added).
@Injectable({
  providedIn: 'root'
})
export class CustomService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private context(authorize: boolean): HttpContext {
    return new HttpContext().set(SKIP_AUTH, !authorize);
  }

  private contentTypeHeaders(includeContentType: boolean): Record<string, string> {
    return includeContentType ? { 'Content-Type': 'application/json' } : {};
  }

  public getRequest<T>(url: string, params?: HttpParams, authorize = true): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${url}`, {
      params,
      context: this.context(authorize)
    });
  }

  public getBlobRequest(url: string, params?: HttpParams, authorize = true): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${url}`, {
      params,
      context: this.context(authorize),
      responseType: 'blob'
    });
  }

  public postBlobRequest(url: string, data: unknown, authorize = true): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/${url}`, data, {
      headers: this.contentTypeHeaders(true),
      context: this.context(authorize),
      responseType: 'blob'
    });
  }

  public postRequest<T>(
    url: string,
    data: unknown,
    headers?: Record<string, string | string[]>,
    authorize = true,
    includeContentType = true
  ): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${url}`, data, {
      headers: { ...this.contentTypeHeaders(includeContentType), ...(headers ?? {}) },
      context: this.context(authorize)
    });
  }

  public putRequest<T>(url: string, data: unknown, authorize = true, includeContentType = true): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${url}`, data, {
      headers: this.contentTypeHeaders(includeContentType),
      context: this.context(authorize)
    });
  }

  public patchRequest<T>(url: string, data: unknown, authorize = true, includeContentType = true): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${url}`, data, {
      headers: this.contentTypeHeaders(includeContentType),
      context: this.context(authorize)
    });
  }

  public deleteRequest<T>(url: string, authorize = true): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${url}`, {
      context: this.context(authorize)
    });
  }
}
