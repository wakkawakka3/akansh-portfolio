function speakName() {
    const utterance = new SpeechSynthesisUtterance("Ekansh Rawat");
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }