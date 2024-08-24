let currentSong = new Audio();
let currentIndex = 0;
let currFolder;
let songs = [];

function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  songs = [];
  let a = await fetch(`/${currFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }

  let songUl = document.querySelector(".songs").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                <img src="/Songs/Music.svg" alt="" />
                <div class = "line">
                <span>${song.replaceAll("%20", " ")}</span>
                <img src="/Songs/play.svg" alt="" />
                </div>
        </li>`;
  }

  Array.from(
    document.querySelector(".songs").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".line").firstElementChild.innerHTML.trim());
    });
  });
  playMusic(songs[0]);
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/Playbar/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

const playNextSong = () => {
  if (currentIndex < songs.length - 1) {
    currentIndex++;
    playMusic(songs[currentIndex]);
  }
};

const playPreviousSong = () => {
  if (currentIndex > 0) {
    currentIndex--;
    playMusic(songs[currentIndex]);
  }
};

async function main() {
  await getSongs("songs/nmf");
  playMusic(songs[0], true);
}

play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "/Playbar/pause.svg";
  } else {
    currentSong.pause();
    play.src = "/Playbar/play.svg";
  }
});

currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
    currentSong.currentTime
  )}/${secondsToMinutesSeconds(currentSong.duration)}`;
  document.querySelector(".circle").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

document.getElementById("next").addEventListener("click", playNextSong);
document.getElementById("previous").addEventListener("click", playPreviousSong);

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-100%";
});

document
  .querySelector(".volume")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

document.querySelector(".volume>img").addEventListener("click", (e) => {
  if (e.target.src.includes("/playbar/volume.svg")) {
    e.target.src = e.target.src.replace(
      "/playbar/volume.svg",
      "/playbar/mute.svg"
    );
    currentSong.volume = 0;
    document
      .querySelector(".volume")
      .getElementsByTagName("input")[0].value = 0;
  } else {
    e.target.src = e.target.src.replace(
      "/playbar/mute.svg",
      "/playbar/volume.svg"
    );
    currentSong.volume = 0.1;
    document
      .querySelector(".volume")
      .getElementsByTagName("input")[0].value = 10;
  }
});

Array.from(document.getElementsByClassName("card")).forEach((e) => {
  e.addEventListener("click", async (item) => {
    song = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
  });
});

main();
