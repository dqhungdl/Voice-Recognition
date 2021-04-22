import React from "react";
import {ReactMediaRecorder} from "react-media-recorder";
import './Recorder.css'
import {Button, createMuiTheme, ThemeProvider} from "@material-ui/core";
import {Delete, Pause, PlayArrowOutlined, Stop,} from "@material-ui/icons";
import MicIcon from '@material-ui/icons/Mic';
import AudioPlayer from "material-ui-audio-player";
import Timer from "react-compound-timer";

class RecorderView extends React.Component {
    muiTheme = createMuiTheme({});

    constructor(props) {
        super(props);
        this.state = {
            showStartButton: true,
            showStopButton: false,
            showPauseButton: false,
            showResumeButton: false,
            showResetButton: false,
            showAudio: false,
            showTimer: false,
            timer: {
                minute: 0,
                second: 0
            }
        }
    }

    startRecording() {
        console.log('Start recording');
        this.setState({
            lastStartTime: Date.now(),
            showStartButton: false,
            showPauseButton: true,
            showTimer: true
        });
    }

    stopRecording() {
        console.log('Stop recording');
        this.setState({
            showStopButton: false,
            showResumeButton: false,
            showResetButton: true,
            showTimer: false,
            showAudio: true
        });
    }

    resumeRecording() {
        console.log('Resume recording');
        this.setState({
            showResumeButton: false,
            showStopButton: false,
            showPauseButton: true
        });
    }

    pauseRecording() {
        console.log('Pause recording');
        this.setState({
            showPauseButton: false,
            showResumeButton: true,
            showStopButton: true
        });
    }

    deleteRecording() {
        console.log('Delete recording');
        this.setState({
            showStartButton: true,
            showStopButton: false,
            showPauseButton: false,
            showResumeButton: false,
            showResetButton: false,
            showAudio: false,
            showTimer: false,
            timer: {
                minute: 0,
                second: 0
            }
        });
    }

    render() {
        return (
            <Timer startImmediately={false}>
                {({start, resume, pause, stop, reset}) => (
                    <ReactMediaRecorder
                        audio
                        onStop={(blobUrl, blob) => this.props.parentCallBack(this.props.recorderId, blob)}
                        render={({
                                     status,
                                     startRecording,
                                     pauseRecording,
                                     resumeRecording,
                                     stopRecording,
                                     mediaBlobUrl,
                                     clearBlobUrl
                                 }) => (
                            <>
                                {
                                    this.state.showTimer &&
                                    <div style={{textAlign: "center", fontSize: 50}}>
                                        <Timer.Minutes
                                            formatValue={text => (text.toString().length > 1 ? text : '0' + text)}
                                        />:
                                        <Timer.Seconds
                                            formatValue={text => (text.toString().length > 1 ? text : '0' + text)}
                                        />
                                    </div>
                                }
                                {
                                    this.state.showAudio &&
                                    <div className='recorder-item recorder-player'>
                                        <ThemeProvider theme={this.muiTheme}>
                                            <AudioPlayer
                                                elevation={1}
                                                width="70%"
                                                variation="primary"
                                                spacing={3}
                                                download={true}
                                                autoplay={true}
                                                order="standart"
                                                preload="auto"
                                                src={mediaBlobUrl}
                                            />
                                        </ThemeProvider>;
                                    </div>
                                }
                                {
                                    this.state.showStartButton &&
                                    <div className='recorder-item'>
                                        <Button variant="contained"
                                                color="primary"
                                                startIcon={<MicIcon/>}
                                                onClick={() => {
                                                    startRecording();
                                                    start();
                                                    this.startRecording();
                                                }}><b>RECORD</b></Button>
                                    </div>
                                }
                                {
                                    this.state.showPauseButton &&
                                    <div className='recorder-item'>
                                        <Button variant="outlined"
                                                color="secondary"
                                                startIcon={<Pause/>}
                                                onClick={() => {
                                                    pauseRecording();
                                                    pause();
                                                    this.pauseRecording();
                                                }}><b>PAUSE</b></Button>
                                    </div>
                                }
                                <span className='recorder-item'>
                                {
                                    this.state.showResumeButton &&
                                    <Button variant="outlined"
                                            color="primary"
                                            startIcon={<PlayArrowOutlined/>}
                                            onClick={() => {
                                                resumeRecording();
                                                resume();
                                                this.resumeRecording();
                                            }}><b>RESUME</b></Button>
                                }{
                                    this.state.showStopButton &&
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<Stop/>}
                                        onClick={() => {
                                            stopRecording();
                                            stop();
                                            this.stopRecording();
                                        }}><b>PREVIEW</b></Button>
                                }</span>
                                {
                                    this.state.showResetButton &&
                                    <div className='recorder-item recorder-delete'>
                                        <Button variant="contained"
                                                startIcon={<Delete/>}
                                                onClick={() => {
                                                    let abortController = new AbortController();
                                                    abortController.abort();
                                                    clearBlobUrl();
                                                    reset();
                                                    this.deleteRecording();
                                                }}><b>DELETE</b></Button>
                                    </div>
                                }
                            </>
                        )}
                    />
                )}
            </Timer>
        )
    }

}

export default RecorderView;

