// Function to generate a 5-second beep sound
const generateBeep = (audioContext) => {
  const duration = 5; // Duration in seconds
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const channelData = buffer.getChannelData(0);

  const frequency = 440; // Frequency of the beep (A4)
  for (let i = 0; i < channelData.length; i++) {
    channelData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  return source;
};

// Function to inject audio into the stream
const injectAudioIntoMeet = async (audioContext, generatedStream) => {
  try {
    // Request access to the user's media devices
    const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    // Create a new MediaStream to combine user media and generated audio
    const combinedStream = new MediaStream();

    // Add the video tracks to the combined stream
    userMediaStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

    // Mute the user's audio tracks
    userMediaStream.getAudioTracks().forEach(track => track.stop());

    // Add the generated audio track to the combined stream
    const generatedAudioTrack = generatedStream.getAudioTracks()[0];
    combinedStream.addTrack(generatedAudioTrack);

    // Replace the existing media stream in the video element with the new combined stream
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.srcObject = combinedStream;
      videoElement.play();
    }
    const audioElement = document.querySelector('audio');
    if (audioElement) {
        audioElement.srcObject = combinedStream;
        audioElement.play();
    }
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
};

// Main function to start audio generation and injection
const startAudioInjection = async () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Ensure the AudioContext is resumed after a user gesture
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const beepSource = generateBeep(audioContext);

  // Create a MediaStreamDestination node
  const mediaStreamDestination = audioContext.createMediaStreamDestination();

  // Connect the beep source to the MediaStreamDestination node
  beepSource.connect(mediaStreamDestination);

  // Inject the generated audio stream into the Google Meet session
  injectAudioIntoMeet(audioContext, mediaStreamDestination.stream);

  // Start the beep sound and stop after 5 seconds
  beepSource.start();
  beepSource.stop(audioContext.currentTime + 5);
};

// Listen for a message from the popup to start the audio injection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAudioInjection') {
    startAudioInjection();
  }
});
