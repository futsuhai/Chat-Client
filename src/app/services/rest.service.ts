import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type GET_PARAMS = {
  [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private _restOptionsDefault: RestOptions = {
    isApiResponse: true,
    hasNote: true,
    urlPrefix: 'http://localhost:5137'
  };

  constructor(private _http: HttpClient) { }

  public restGET<T = Response>(endpoint: string, params: GET_PARAMS = {}, options?: Omit<RestOptions, 'body'>): Observable<T> {
    return this.request('GET', endpoint, {
      ...options,
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  public restPOST<T = Response>(endpoint: string, body: object | null = null, options?: Omit<RestOptions, 'body'>): Observable<T> {
    return this.request('POST', endpoint, {
      ...options,
      body
    });
  }

  public restPUT<T = Response>(endpoint: string, body: object | null = null, options?: Omit<RestOptions, 'body'>): Observable<T> {
    return this.request('PUT', endpoint, {
      ...options,
      body
    });
  }

  public restDELETE<T = Response>(endpoint: string, body: object | null = null, options?: Omit<RestOptions, 'body'>): Observable<T> {
    return this.request('DELETE', endpoint, {
      ...options,
      body
    });
  }

  public request<T>(method: string, endpoint: string, options: RestOptions = this._restOptionsDefault): Observable<T> {
    const preparedOptions = this._prepareRestOptions(options);

    const context = new HttpContext();

    const httpOptions: HttpOptions = {
      ...preparedOptions,
      context,
    };

    return this._http.request(method, preparedOptions.urlPrefix + endpoint, httpOptions);
  }

  private _prepareRestOptions(options: RestOptions = this._restOptionsDefault): RestOptions {
    return {
      ...options,
      isApiResponse: options.isApiResponse ?? this._restOptionsDefault.isApiResponse,
      hasNote: options.hasNote ?? this._restOptionsDefault.hasNote,
      urlPrefix: options.urlPrefix ?? this._restOptionsDefault.urlPrefix,
    };
  }
}

export interface RestOptions extends HttpOptions {
  isApiResponse?: boolean;
  hasNote?: boolean;
  urlPrefix?: string;
}

interface HttpOptions {
  body?: unknown;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: 'body' | 'response';
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  responseType?: 'json' | 'blob';
  reportProgress?: boolean;
  withCredentials?: boolean;
}