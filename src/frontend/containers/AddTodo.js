/* eslint-disable react/no-set-state,react/prop-types */
import React from 'react';
import {connect} from 'react-redux';
import {Form, FormGroup, InputGroup, FormControl, Button} from 'react-bootstrap';
import {put} from 'axios/index';
import LoadingIndicator from '../components/Loading';

import {createTodo} from '../actions';

// eslint-disable-next-line no-undef
const serverUrl = TODOMVC_BACKEND_URL;

const defaultState = {
    input: '',
    loading: false
};

export const mapStateToProps = (state) => ({
    auth: state.auth
});

export class AddTodo extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = defaultState;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            input: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.state.input.trim()) {
            return;
        }
        
        this.setState({ loading: true });
        
        const todo = {
            completed: false,
            text: this.state.input.trim()
        };

        const response = await put(`${serverUrl}todos`, todo, {
            headers: {
                authorization: this.props.auth.idToken
            }
        });

        const location = response.headers.location;
        const id = location.substring(location.lastIndexOf('/') + 1);

        this.props.dispatch(createTodo({
            ...todo,
            id
        }));

        this.setState(defaultState);
    }

    render() {
        const isLoading = this.state.loading;
        return (
            <div>
                {isLoading && <LoadingIndicator /> }
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="input">
                        <InputGroup>
                            <FormControl
                                name="input"
                                onChange={this.handleChange}
                                type="text"
                                value={this.state.input}
                            />
                            <InputGroup.Button>
                                <Button type="submit">{'Add Todo'}</Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps)(AddTodo);
/* eslint-enable */
