export interface SpotifyTrack {
  name: string;
  external_urls: {
    spotify: string;
  };
  artists: {
    name: string;
  }[];
}

export interface SpotifyResponse {
  tracks?: {
      items: SpotifyTrack[];
  };
}
