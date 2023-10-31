import { ID3Writer } from "browser-id3-writer";
import fs, { readFileSync, writeFileSync, readFile } from "fs";
import request from "request";

const $ = {
    songArtists: 'TPE1',
    songComposers: 'TCOM',
    songGenres: 'TCON',
    language: 'TLAN',
    contentGroupDescription: 'TIT1',
    songTitle: 'TIT2',
    songSubtitle: 'TIT3',
    albumTitle: 'TALB',
    albumArtist: 'TPE2',
    'conductor/performerRefinement': 'TPE3',
    'interpreted,Remixed,OrOtherwiseModifiedBy': 'TPE4',
    "songNumberInAlbum):'5'Or'5/10": 'TRCK',
    "albumDiscNumber):'1'Or'1/3": 'TPOS',
    labelName: 'TPUB',
    initialKey: 'TKEY',
    mediaType: 'TMED',
    "albumReleaseDateExpressedAs'DDMM'": 'TDAT',
    'isrc-InternationalStandardRecordingCode': 'TSRC',
    copyrightMessage: 'TCOP',
    'lyricist/TextWriter': 'TEXT',
    commercialInformation: 'WCOM',
    'copyright/LegalInformation': 'WCOP',
    officialAudioFileWebpage: 'WOAF',
    'officialArtist/performerWebpage': 'WOAR',
    officialAudioSourceWebpage: 'WOAS',
    officialInternetRadioStationHomepage: 'WORS',
    payment: 'WPAY',
    publishersOfficialWebpage: 'WPUB',
    songDurationInMilliseconds: 'TLEN',
    albumReleaseYear: 'TYER',
    beatsPerMinute: 'TBPM'     
}
// const $ = {
//     // Array of Strings
//     artists: "TPE1",
//     composers: "TCOM",
//     genres: "TCON",
//     // Strings
//     language: "TLAN",
//     contentGroupDescription: "TIT1",
//     songTitle: "TIT2",
//     subtitle: "TIT3",
//     artist: "TPE2",
// }


const songName = `ダイジョブですか？`;

// function readFromFile(){
//     const songBuffer = readFileSync(`./${songName}.mp3`);
//     console.log(songBuffer)
//     readFile(`./${songName}.mp3`, function(err, data){
//         if(err)throw err
//         console.log(data)
//     })
// }



var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



function writeSong(apiData, newImage){
    let newName = "ダイジョブですか"
    const songBuffer = readFileSync(`./${newName}.mp3`);
    const coverBuffer = readFileSync(`./${newImage}`);

    const writer = new ID3Writer(songBuffer);
    writer
    .setFrame($.songTitle, apiData.name)
    .setFrame($.songArtists, [apiData.artist])
    // .setFrame($.songGenres, apiData.tags)
    .setFrame($.albumTitle, apiData.album || apiData.name)
    .setFrame($.albumReleaseYear, apiData.date)
    // .setFrame("IPLS", apiData.artist)
    .setFrame('APIC', {
        type: 3,
        data: coverBuffer,
        description: 'Super picture',
    });
    writer.addTag();

    const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
    writeFileSync('song_with_tags.mp3', taggedSongBuffer);
}

async function getData(songName) {
    const id = 540957;
    const convertName = encodeURIComponent(songName);
    console.log(convertName)
    const url = `https://vocadb.net/api/songs/${id}?fields=Tags,Artists&lang=Default`
    // const url2 = `https://vocadb.net/api/entries?query=%E3%83%88%E3%83%BB%E3%82%A2%E3%83%9A%E3%82%A4%E3%83%AD%E3%83%B3%20%20&fields=Tags&Artists&childTags=true&start=0&maxResults=10&getTotalCount=false`
    const url2 =`https://vocadb.net/api/songs?query=${encodeURIComponent(songName)}&fields=Tags,Artists,MainPicture,Albums&childTags=true&unifyTypesAndTags=false&childVoicebanks=false&includeMembers=false&onlyWithPvs=false&start=0&maxResults=10&getTotalCount=false&preferAccurateMatches=false`
    const res = await fetch(url2);
    const data = await res.json();
    // console.log(data)
    const item = data.items[0];
    console.log(item)
    const newData = {
        date: item.createDate?.split("-")[0],
        tags: item.tags.map(tag => tag?.tag?.name),
        name: item.name == "Undefined" ? songName : item.name,
        id: item.id,
        album: item.albums[0],
        artist: item.artists.filter((artist) => artist.categories.toLowerCase().includes("producer"))[0].name,
        // artists: item.artists.reduce((obj, artist) => {
        //     if(obj[artist?.categories]){
        //         obj[artist?.categories] += " & " + artist?.name
        //     } else {
        //         obj[artist?.categories] = artist?.name
        //     }
        //     return obj
        //     // return [...obj, [artist.categories.toLowerCase(), artist.name]]
        // }, {}),
        picture: item.mainPicture?.urlOriginal
    }
    console.log(newData);
    download(newData.picture, 'newImage.png', function(){
        console.log('done');
        writeSong(newData, "newImage.png");
    });

}
// readFromFile()
getData(songName)