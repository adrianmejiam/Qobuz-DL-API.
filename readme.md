# Qobuz-DL API

A simple API for searching and downloading music from **Qobuz**. All endpoints return JSON responses.

## Features
- Search for albums and tracks on Qobuz
- Get detailed album information
- Get a download URL for a track
> [!IMPORTANT]
> This repository does not contain any copyrighted material, or code to illegaly download music. Downloads are provided by the Qobuz API and should only be initiated by the API token owner. The author is **not responsible for the usage of this repository nor endorses it**, nor is the author responsible for any copies, forks, re-uploads made by other users, or anything else related to Qobuz-DL API. Any live demo found online of this project is not associated with the authors of this repo. This is the author's only account and repository.
### Configuration
Before running the project, you need to configure the API credentials in `lib/qobuz-dl.tsx`:
```tsx
const ENV = {
  QOBUZ_API_BASE: "https://www.qobuz.com/api.json/0.2/",
  QOBUZ_APP_ID: "",
  QOBUZ_SECRET: "",
  QOBUZ_AUTH_TOKENS: [""],
  NEXT_PUBLIC_GITHUB: "https://github.com/Sheikhlipu123/Qobuz-DL-API",
  NEXT_PUBLIC_DISCORD: "https://discord.gg/EBKcDZwEHJ",
  NEXT_PUBLIC_APPLICATION_NAME: "Qobuz-DL API",
};
```
## Endpoints

### Search Music
Search for albums and tracks on Qobuz.

#### `GET /api/get-music?q=query&offset=0&limit=10`
**Parameters:**
- `q` (required): Search query
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Number of results per page (default: 10, max: 50)

### Get Album
Retrieve detailed information about an album, including tracks.

#### `GET /api/get-album?album_id=album_id`
**Parameters:**
- `album_id` (required): Qobuz album ID

### Get Download URL
Retrieve a download URL for a track.

#### `GET /api/download-music?track_id=track_id&quality=27`
**Parameters:**
- `track_id` (required): Qobuz track ID
- `quality` (optional): Quality ID (default: 27)
  - `27`: 24-bit / 192kHz
  - `7`: 24-bit / 96kHz
  - `6`: 16-bit / 44.1kHz
  - `5`: MP3 320kbps

## Example Usage

### Search for Music
```javascript
fetch('/api/get-music?q=daft+punk&limit=5')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Get Album Details
```javascript
fetch('/api/get-album?album_id=0060254783339')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Get Download URL for a Track
```javascript
fetch('/api/download-music?track_id=52155495&quality=27')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Credits
This project is a **fork** of [Qobuz-DL](https://github.com/QobuzDL/Qobuz-DL).

## License
[MIT License](LICENSE)
