import { LocatorService } from "../../locator.service";
import { ToastService } from "../../toast-container/toast.service";
import { ConfigService } from "../services/config/config.service";

export async function fetcher(url: string, args: Partial<FetcherArgs> = { method: 'GET', headers: [], body: null }): Promise<Response> {
  let token = '';
  try {
    token = await getCSRFToken() as string;
  } catch (e) {
    console.error('Failed to get CSRF Token. Check the the server is running and that the URL is correct');
    LocatorService.injector.get(ToastService).error('Failed to get CSRF Token. Check the the server is running and that the URL is correct');
    throw 'CSRF Error';
  }

  // Add the XSRF token to the header list
  let headers = new Headers(args.headers);
  headers.append('X-XSRF-TOKEN', token);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  return fetch(LocatorService.injector.get(ConfigService).get('apiURL') + 'api/' + url, {
    method: args.method,
    headers: headers,
    body: args.body,
    credentials: 'include'
  });
}

export async function getCSRFToken() {
  let token = getCookie('XSRF-TOKEN');

  if (!token) {
    console.log('Fetching CSRF token.');
    let res = await fetch(LocatorService.injector.get(ConfigService).get('apiURL') + 'sanctum/csrf-cookie', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (res.ok) {
      console.log('Fetched token!');
      return getCookie('XSRF-TOKEN');
    }

    throw 'CSRF Error.'
  }

  return token;
}

export function getCookie(cookieName: string): string | null {
  let match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export type FetcherArgs = {
  method: string,
  headers: HeadersInit,
  body: BodyInit | null
}
