const data = `TPE1 (song artists)
TCOM (song composers)
TCON (song genres)
TLAN (language)
TIT1 (content group description)
TIT2 (song title)
TIT3 (song subtitle)
TALB (album title)
TPE2 (album artist)
TPE3 (conductor/performer refinement)
TPE4 (interpreted, remixed, or otherwise modified by)
TRCK (song number in album): '5' or '5/10'
TPOS (album disc number): '1' or '1/3'
TPUB (label name)
TKEY (initial key)
TMED (media type)
TDAT (album release date expressed as 'DDMM')
TSRC (isrc - international standard recording code)
TCOP (copyright message)
TEXT (lyricist / text writer)
WCOM (commercial information)
WCOP (copyright/Legal information)
WOAF (official audio file webpage)
WOAR (official artist/performer webpage)
WOAS (official audio source webpage)
WORS (official internet radio station homepage)
WPAY (payment)
WPUB (publishers official webpage)
TLEN (song duration in milliseconds)
TYER (album release year)
TBPM (beats per minute)`

const res = data.split("\n").map(item => {
    console.log(item)
    const arr = item.split("(")
    const val = arr[0].trim()
    let name = arr[1].substring(0, arr[1].length-1)
    console.log(name)
    name = name.split(" ").map((word,i) => {
        // console.log(word)
        if(i == 0){
            return word
        }
        const firstLetter = word[0].toUpperCase();
        const remainder = word.substring(1, word.length)
        return firstLetter + remainder;
    }).join("")
    return [name, val]
}).reduce((acc, cur) => {
    acc[cur[0]] = cur[1]
    return acc
}, {})

console.log(res)