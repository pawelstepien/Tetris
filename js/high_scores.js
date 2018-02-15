String.prototype.escapeDiacritics = function()
{
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}

const highScores = {

config : {
  apiKey: "AIzaSyClwSzGLCIn4S20UisHxpQYqJKqJKmBrFQ",
  authDomain: "tetris-1aaf5.firebaseapp.com",
  databaseURL: "https://tetris-1aaf5.firebaseio.com",
  projectId: "tetris-1aaf5",
  storageBucket: "",
  messagingSenderId: "261711421963"
},


sendHighScore(score){
    const record = {};
    record.score = score;
    record.name = prompt("What's your name?", "Kasia Cichopek");
    if (record.name === null) {
        return;
    }
    record.name= record.name.escapeDiacritics();
    firebase.initializeApp(this.config);
    const ref = firebase.database().ref();
    ref.push(record)
}

}
export {highScores};
