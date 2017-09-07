/**
 * Created by xax on 23.02.2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import query from './queries/CurentUser';
import mutation from './mutations/SigninUser';
import Loading from '../../components/Loading';
import {
  withRouter
} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { Button, Typography, Input } from 'material-ui';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

class Signin extends Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  state = {
    email: '',
    password: '',
    errors: []
  };

  componentWillUpdate(nextProps) {
    if (!this.props.data.user && nextProps.data.user) {
      this.props.history.push('/');
    }
  }

  signinUser = async () => {
    const { email, password } = this.state;
    try {
      const response = await this.props.mutate({
        variables: { email, password }
      });
      this.setState({ errors: [] });
      localStorage.setItem('token', response.data.signinUser.token);
      this.props.history.push('/');
    } catch (res) {
      const errors = res.graphQLErrors.map(err => err.message);
      this.setState({ errors });
    }
  };

  render() {
    const { classes, data: { loading } } = this.props;
    if (loading) {
      return (<Loading />);
    }
    return (
      <form
        className={classes.container}
        role="form"
        onSubmit={this.signinUser}
      >
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            value={this.state.email}
            onChange={ev => this.setState({ email: ev.target.value })}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={this.state.password}
            onChange={ev => this.setState({ password: ev.target.value })}
          />
        </FormControl>
        <div>
          {this.state.errors.map(err =>
            <Typography color='accent' key={err}>
              {err}
            </Typography>
          )}
        </div>
        <Button type="submit" raised color="primary" className={classes.button}>
          Submit
        </Button>
      </form>
    );
  }
}

export default withRouter(withStyles(styles)(graphql(query)(
  graphql(mutation)(Signin)))
);
