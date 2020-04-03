import React, {Component} from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Alert, Container, Form} from "reactstrap";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {ws} from "../../store/action/actionsChat";


class Main extends Component {
    state = {
        text: '',
    };

    changeField = e => this.setState({[e.target.name]: e.target.value});

    componentDidMount() {
        let url = 'ws://localhost:8000/chat';
        if (this.props.user) {
            url += '?token=' + this.props.user.token
        }

        this.websocket = new WebSocket(url);
        this.websocket.onmessage = (message) =>{
            this.props.ws(message.data)
        }

    }

    onSubmitHandler = e => {
        e.preventDefault();

        const message = {
            type: 'CREATE_MESSAGE',
            text: this.state.text
        };

        this.websocket.send(JSON.stringify(message));
    };

    render() {
        if (!this.props.user) {
            return <Redirect to='/login'/>
        }
        return (
            <Container>
                <Box style={{display: 'flex', flexWrap: 'wrap', margin: '0 auto'}} component="div">
                    <Grid item xs={3}>
                        <Box boxShadow={5} style={{border: '3px solid #1565c0', height: '536px', overflowY: 'auto'}}
                             component="div"
                             p={1} m={1}>
                            <h6>Online Users</h6>
                            <hr style={{margin: "5px 0", backgroundColor: '#1976d2', padding: '1px'}}/>
                            {this.props.userOnline.map((user, i) => (
                                <Alert key={i} color="secondary">

                                    <h6>{user}</h6>
                                </Alert>

                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box boxShadow={5} style={{border: '3px solid #1565c0', height: '450px', overflowY: 'auto'}}
                             component="div"
                             p={1} m={1}>
                            <h6>Chat Room</h6>
                            <hr style={{margin: "5px 0", backgroundColor: '#1976d2', padding: '1px'}}/>
                            {this.props.messages.map((mess,i) => (

                                <Alert key={i} color="primary">
                                    <p>Date: {new Date(mess.datetime).toLocaleString()}</p>
                                    <p>Username: {mess.user}</p>
                                    <p>{mess.message}</p>
                                </Alert>

                            ))}

                        </Box>
                        <Box boxShadow={5} style={{border: '3px solid #1565c0'}} m={1} p={1}>
                            <Form onSubmit={this.onSubmitHandler}>
                                <Box style={{display: 'flex', flexWrap: 'wrap', margin: '0 auto'}} component="div">
                                    <Grid item xs={10}>
                                        <TextField onChange={this.changeField} style={{width: '98%'}} type='text'
                                                   name='text' id="outlined-basic" label="Enter Your Message"
                                                   variant="outlined"/>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button style={{width: '100%', height: '97%'}} variant="contained"
                                                color="primary" type="submit">Send</Button>
                                    </Grid>
                                </Box>
                            </Form>
                        </Box>
                    </Grid>
                </Box>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.users.user,
        messages:state.chat.messages,
        userOnline:state.chat.userOnline
    }
};

const mapDispatchToProps = dispatch => ({

        ws: (url) => dispatch(ws(url))

});
export default connect(mapStateToProps, mapDispatchToProps)(Main)