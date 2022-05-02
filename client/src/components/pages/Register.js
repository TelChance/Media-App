import React, { useState} from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';


function Register() {
    const [values, setValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    }

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result){ 
        },
        variables: values
    })

    const onSubmit = (event) => {
        event.preventDefault();
        addUser();
    };

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Register</h1>
                <Form.Input
                label="Username"
                placeholder="Username.."
                name="username"
                type="text"
                value={values.username}
                onChange={onChange}
                />
                <Form.Input
                label="password"
                placeholder="password.."
                name="password"
                type="password"
                value={values.password}
                onChange={onChange}
                />
                <Form.Input
                label="confirmPassword"
                placeholder="confirmPassword.."
                name="confirmPassword"
                type="confirmPassword"
                value={values.confirmPassword}
                onChange={onChange}
                />
                <Form.Input
                label="email"
                placeholder="email.."
                name="email"
                type="email"
                value={values.email}
                onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
        </div>
    );
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $password: String!
        $confirmPassword: String!
        $email: String!
    ) {
        register(
            registerInput: {
                username: $username
                password: $password
                confirmPassword: $confirmPassword
                email: $email
            }
        ){
            id 
            email
            username
            createdAt
            token 

        }
    }
`

export default Register;