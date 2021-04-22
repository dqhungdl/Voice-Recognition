import React from 'react';
import RecorderView from "../recorder/Recorder";
import './Split.css';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    CssBaseline,
    Grid,
    Typography,
    withStyles
} from "@material-ui/core";
import CompareIcon from '@material-ui/icons/Compare';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import axios from 'axios';
import ResultDialog from "../dialog/Dialog";

const styles = theme => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
});

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            {new Date().getFullYear()}
        </Typography>
    );
}

class SplitView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blobs: [null, null]
        };
        this.updateBlob = this.updateBlob.bind(this);
    }

    updateBlob(recorderId, blob) {
        console.log('Update blobs:', blob);
        let newBlobs = this.state.blobs;
        newBlobs[recorderId - 1] = blob.blob;
        this.setState({
            blobs: newBlobs
        });
    }

    uploadMedia(callback) {
        console.log('Upload media');
        const form = new FormData();
        form.append('files', this.state.blobs[0], 'first_audio.wav');
        form.append('files', this.state.blobs[1], 'second_audio.wav');
        axios.post('http://localhost:8000/comparespeaker/', form,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(response => {
            console.log('Result:', response['data']['same_speaker_probability']);
            callback(response['data']['same_speaker_probability']);
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <>
                <CssBaseline/>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            <b>Voice recognition</b>
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Given audio of two speakers, determine those audio are from a same person or not.
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary"
                                            onClick={() => window.open("https://github.com/NewLuminous/voice-recognition", "_blank")}>
                                        <b>Our Github repo</b>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary"
                                            onClick={() => window.open("https://github.com/NewLuminous/voice-recognition/blob/master/README.md", "_blank")}>
                                        <b>About contributors</b>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container maxWidth='xl'>
                    <Grid container>
                        <Grid item xs>
                            <Card style={{backgroundColor: '#ffe6e6', height: "100%"}}>
                                <CardHeader title={<b>First audio
                                    <hr/>
                                </b>}
                                            titleTypographyProps={{variant: 'h3'}}
                                            avatar={<RecordVoiceOverIcon style={{fontSize: 40}}/>}/>
                                <CardContent
                                    children={<RecorderView recorderId={1} parentCallBack={this.updateBlob}/>}/>
                            </Card>
                        </Grid>
                        <Grid item xs>
                            <Card style={{backgroundColor: '#e6ffe6', height: "100%"}}>
                                <CardHeader title={<b>Second audio
                                    <hr/>
                                </b>}
                                            titleTypographyProps={{variant: 'h3'}}
                                            avatar={<RecordVoiceOverIcon style={{fontSize: 40}}/>}/>
                                <CardContent
                                    children={<RecorderView recorderId={2} parentCallBack={this.updateBlob}/>}/>
                            </Card>
                        </Grid>
                    </Grid>
                    <div className='upload-button'>
                        <ResultDialog onRef={ref => (this.child = ref)}/>
                        <Button variant="contained"
                                startIcon={<CompareIcon/>}
                                style={{backgroundColor: "#5cb85c", color: "white"}}
                                onClick={() => {
                                    this.uploadMedia(this.child.onOpen);
                                }}>
                            <b>COMPARE</b>
                        </Button>
                    </div>
                </Container>
                <footer className={classes.footer}>
                    <Typography variant="h6" align="center" gutterBottom>
                        University of Engineering and Technology - VNU<br/>
                        Faculty of Computer Science<br/>
                        Technology Workshop - INT3414 20
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Quoc An Nguyen, Quoc Hung Duong, Minh Tan Nguyen
                    </Typography>
                    <Copyright/>
                </footer>
            </>
        )
    }
}

export default withStyles(styles)(SplitView);