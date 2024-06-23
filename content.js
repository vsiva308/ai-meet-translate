navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(stream => {
    if(stream.getAudioTracks().length == 0) return alert('You must share your tab with audio. Refresh the page.')
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    socket = new WebSocket('wss://api.deepgram.com/v1/listen?tier=enhanced', ['token', '3a3e2674b4fff09f2e71449110c9ba91586af621'])

    recorder.addEventListener('dataavailable', evt => {
        if(evt.data.size > 0 && socket.readyState == 1) socket.send(evt.data)
    })

    socket.onopen = () => { recorder.start(250) }

    socket.onmessage = msg => {
        const { transcript } = JSON.parse(msg.data).channel.alternatives[0]
        if(transcript) {
            console.log(transcript)
        }
    }
})