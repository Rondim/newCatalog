import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Input } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Multiselect } from 'react-widgets';
import _ from 'lodash';
import 'react-widgets/dist/css/react-widgets.css';

import query from './queries/fetchSheets';
import Loading from '../../components/Loading';
import { openPopup, closePopup } from '../Popup/actions';
import createSheet from './mutations/createSheet';
import removeSheet from './mutations/removeSheet';
import updateSheet from './mutations/updateSheet';
import shareSheet from './mutations/shareSheet';
import removeShareFromSheet from './mutations/removeShareFromSheet';

@graphql(query, {
  options(props) {
    return {
      variables: {
        userId: props.user.id
      }
    };
  }
})
@compose(
  graphql(shareSheet, { name: 'shareSheet' }),
  graphql(createSheet, { name: 'createSheet' }),
  graphql(removeSheet, { name: 'removeSheet' }),
  graphql(updateSheet, { name: 'updateSheet' }),
  graphql(removeShareFromSheet, { name: 'removeShareFromSheet' })
)
@connect(null, { openPopup, closePopup })
class SheetsManager extends Component {
  static propTypes = {
    data: PropTypes.shape({
      allSheetLists: PropTypes.array,
      allUsers: PropTypes.array,
      loading: PropTypes.bool
    }),
    createSheet: PropTypes.func,
    removeSheet: PropTypes.func,
    shareSheet: PropTypes.func,
    removeShareFromSheet: PropTypes.func,
    updateSheet: PropTypes.func,
    openPopup: PropTypes.func,
    closePopup: PropTypes.func,
    user: PropTypes.shape({
      id: PropTypes.string
    }),
    history: PropTypes.object
  };
  static defaultProps = {};

  state={
    name: '',
    edit: null
  };

  createSheet = async () => {
    const { name } = this.state;
    const { user: { id }, createSheet, closePopup } = this.props;
    await createSheet({ variables: { name, userIds: [id] }, refetchQueries: [{ query, variables: { userId: id } }] });
    closePopup();
  };

  shareSheet = (action, { id: userId }, id) => {
    const { shareSheet, removeShareFromSheet, closePopup } = this.props;
    switch (action) {
      case 'insert':
        shareSheet({ variables: { id, userId } });
        break;
      case 'remove':
        removeShareFromSheet({ variables: { id, userId } });
    }
    closePopup();
  };

  handleCreateSheet = (ev) => {
    const { openPopup, closePopup } = this.props;
    openPopup({
      confirmation: this.createSheet,
      header: 'Создать новую сетку',
      denial: closePopup,
      body: <label>Имя <Input onChange={ev => this.setState({ name: ev.target.value })} /></label>,
      denialName: 'Отмена',
      confirmationName: 'Создать'
    });
  };

  handleShare = (users, id) => {
    const { openPopup, closePopup } = this.props;
    openPopup({
      confirmation: closePopup,
      header: 'Поделиться сеткой',
      body: this.renderModalShare(users, id),
      confirmationName: 'Ок'
    });
  };

  removeSheet = (id, userId) => {
    this.props.removeSheet({ variables: { id }, refetchQueries: [{ query, variables: { userId } }] });
  };

  renderModalShare = (users, id) => {
    const { allUsers } = this.props.data;
    const { user } = this.props;
    const val = _.filter(users, o=> o.id !== user.id);
    const data = _.filter(allUsers, o=> o.id !== user.id);
    return <Multiselect
      data={data}
      value={val}
      textField='email'
      valueField='id'
      onChange={(val, { action, dataItem }) => this.shareSheet(action, dataItem, id)}
    />;
  };

  renderUserList = (users, id) => {
    const { user } = this.props;
    const val = _.filter(users, o=> o.id !== user.id).map(o => o.email.replace(/@.+/, ''));
    return <div>{val.join(', ')}</div>;
  };

  submitRename = async ev => {
    if (ev.keyCode === 13) {
      const { name, edit } = this.state;
      await this.props.updateSheet({ variables: { id: edit, name } });
      this.setState({ name: '', edit: null });
    }
  };

  renderList() {
    const { data: { allSheetLists }, user } = this.props;
    const { edit, name } = this.state;
    return allSheetLists.map( sheet => {
      return (
        <tr key={sheet.id}>
          <th scope="row">
            {edit === sheet.id ?
              <Input
                value={name}
                onChange={ev => this.setState({ name: ev.target.value })}
                autoFocus
                onKeyDown={this.submitRename}
              /> :
              <div onClick={()=> window.open(`sheet/${sheet.id}`, '_blank')} style={{ heigth: '100%', width: '100%' }}>
                {sheet.name}
              </div>}
          </th>
          <td onClick={()=> window.open(`sheet/${sheet.id}`, '_blank')}>
            {this.renderUserList(sheet.users, sheet.id)}
          </td>
          <td style={{ width: '150px' }}>
            <Button color='success' onClick={() => this.handleShare(sheet.users, sheet.id)}>
              <FontAwesome name='share' />
            </Button>
            <Button color='info' onClick={() => this.setState(() => ({ edit: sheet.id, name: sheet.name }) )}>
              <FontAwesome name='edit' />
            </Button>
            <Button
              onClick={() => this.removeSheet(sheet.id, user.id)}
              color='danger'
            >
              <FontAwesome name='trash' />
            </Button>
          </td>
        </tr>
      );
    });
  }

  render() {
    const { loading } = this.props.data;
    if (loading) return <Loading />;
    return (
      <div>
        <Button onClick={this.handleCreateSheet} color='success'><FontAwesome name='plus' /></Button>
        <Table striped hover>
          <thead>
          <tr>
            <th>Название сетки</th>
            <th>Спиоск доступа</th>
            <th>Действие</th>
          </tr>
          </thead>
          <tbody>
            {this.renderList()}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default SheetsManager;
