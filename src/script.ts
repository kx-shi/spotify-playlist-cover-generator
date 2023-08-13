const clientId = "YOUR_CLIENT_ID";
const clientSecret = "YOUR_CLIENT_SECRET";
const clientInfo = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

const cover = new CustomP5;

let playlistName = "";
let playlistSubmitForm = document.getElementById('playListForm');
let coverGenerated = false;

import { CustomP5 } from './sketch.ts'

const accessToken = await getAccessToken();

if (playlistSubmitForm != null) {
    playlistSubmitForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let playlistURL = document.getElementById("playlistLink") as HTMLInputElement | null;
        // TODO: Regex to get playlist id from full URL

        if (playlistURL != null) {
            getPlayList(playlistURL.value, accessToken);
          }
    })
}

export async function getAccessToken() {
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: clientInfo
    });

    const { access_token } = await result.json();
    return access_token;
}

/**
 * Get playlist songs and calculate danceability, energy, instrumentalness, liveness, loudness, speechiness
 * Danceability: How suitable a track is for dancing. 0 - least danceable, 1 - most danceable
 * Energy: Perceptual measure of intensity and activity. 0-1, high energy tracks feel fast, loud and noisy
 * Instrumentalness: Whether track contains vocals (0) or is fully instrumental (0.5-1, confidence increases)
 * 
 * @param playlist The playlist whose tracks are analysed
 * 
 */
export async function getPlayList(playlist_id: string, accessToken: string) { // TODO: Add type safety around the data for getPlayListSongs
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer  ${accessToken}` }
    })

    let playlist = await result.json();

    playlistName = playlist.name
    document.getElementById("playlistName")!.innerText = playlistName;

    let tracks = (playlist.tracks.items).map((item: {track: any}) => item.track.id);

    let feature_list: Track[] = [];
    let number_of_tracks = tracks.length;
    var tracks_processed = 0;

    tracks.forEach(async (track: string) => {
        // Get track ID
        let track_features = await getAudioFeatures(track);
        feature_list.push(track_features);
        
        tracks_processed++;
        if(tracks_processed == number_of_tracks) { createAlbumCover(feature_list) }
    })
}

async function getAudioFeatures(track_URI: any): Promise<Track> {
    const result = await fetch(`https://api.spotify.com/v1/audio-features/${track_URI}`, {
        method: "GET",
        headers: { "Authorization": `Bearer  ${accessToken}` }
    });

    return await result.json();
}

function createAlbumCover(feature_list: Array<Track>) {
    let danceability = 0.0;
    let instrumentalness = 0.0;
    let energy = 0.0;
    let valence = 0.0;
    let major_mode = 0;
    let minor_mode = 1;
    let mode = 0;

    feature_list.forEach(track => {
        danceability = danceability + track.danceability;
        instrumentalness = instrumentalness + track.instrumentalness;
        energy = energy + track.energy;
        valence = valence + track.valence;

        if(track.mode == 1) {
            major_mode++;
        }else {
            minor_mode++;
        }
    });

    danceability = danceability / feature_list.length;
    instrumentalness = instrumentalness / feature_list.length;
    energy = energy / feature_list.length;
    valence = valence / feature_list.length;


    if(major_mode > minor_mode) {
        mode = 1;
    }else {
        mode = 0;
    }
    let mode_text = "";

    if(mode == 1) {
        mode_text = "Major"
    }else {
        mode_text = "Minor"
    }

    document.getElementById("playlistInfo")!.innerText = `Danceability: ${danceability}\nInstrumentalness: ${instrumentalness}\nEnergy: ${energy}\nValence: ${valence}\nMode: ${mode_text}(${mode})`;

    if(coverGenerated) {
        cover.delete();
        cover.deleteSaveButton();
    }
    cover.setup();
    cover.setBackground(mode, instrumentalness)
    cover.drawCircles(danceability, valence, energy);
    cover.createSaveButton(playlistName);

    coverGenerated = true;
}

