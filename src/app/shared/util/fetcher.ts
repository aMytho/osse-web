import { LocatorService } from "../../locator.service";
import { ConfigService } from "../services/config/config.service";

export function fetcher(url: string, args: Partial<FetcherArgs> = { method: 'GET', headers: [], body: null }): Promise<Response> {
  return fetch(LocatorService.injector.get(ConfigService).get('apiURL') + 'api/' + url, {
    method: args.method,
    headers: args.headers,
    body: args.body
  });
}

export type FetcherArgs = {
  method: string,
  headers: HeadersInit,
  body: BodyInit | null
}
