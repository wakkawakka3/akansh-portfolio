function speakName() {
  const sound = new SpeechSynthesisUtterance("Ekansh Rawat");
  sound.lang = "en-US";
  speechSynthesis.speak(sound);
}

function livechat(){
    const message = document.getElementsByClassName("message")
}
function updateClock() {
  const localtime = document.getElementsByClassName("local-time")[0];
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  const timeString = `${hours}:${minutes}:${seconds}`;

  localtime.innerHTML = `
    <span class="clock-icon">🕐</span> 
    <span class="live-time">${timeString}</span>    
    <span class="timezone">IST (UTC+5:30)</span>
  `;
}

setInterval(updateClock, 1000);
updateClock();
