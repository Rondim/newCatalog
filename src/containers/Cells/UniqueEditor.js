import React, { Component } from 'react';
import { Button, Jumbotron, Container, Row, Col, Input } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/fontawesome-free-solid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { notification } from '../Notificator/actions';
import { compose, graphql } from 'react-apollo/index';
import createZone from './mutations/createZone.graphql';
import refreshZone from './mutations/refreshZone.graphql';
import query from './queries/fetchCells.graphql';
import fetchPads from './queries/allPads.graphql';
import ZonesList from './ZonesList';

@connect(null, { notification })
@compose(
  graphql(createZone, { name: 'createZone' }),
  graphql(refreshZone, { name: 'refreshZone' }),
)
class UniqueEditor extends Component {
  static propTypes = {
    cells: PropTypes.object,
    sheet: PropTypes.string,
    notification: PropTypes.func,
    createZone: PropTypes.func,
    refreshZone: PropTypes.func
  };
  static defaultProps = {};

  state={
    edit: null,
    name: ''
  };

  onEdit = () => {
    const { cells, notification } = this.props;
    if (cells) {
      this.setState({ edit: 'main' });
    } else {
      notification('warning', 'Область не выбрана');
    }
  };

  onSave = async () => {
    const { sheet, cells } = this.props;
    const { name } = this.state;
    const res = await this.props.createZone({
      variables: { ...cells, sheet, name, type: 'Unique' }
    });
    await this.props.refreshZone({
      variables: { zoneId: res.data.createZone.id, sheetId: sheet },
      refetchQueries: [{ query, variables: { sheet } }, { query: fetchPads, variables: { typeUnique: true } }]
    });
    this.setState({ edit: null, name: '' });
  };

  render() {
    const { edit, name } = this.state;
    switch (edit) {
      case null:
        return (
          <div>
            <Jumbotron>
              <Button className='w-100' onClick={this.onEdit}>Создать<br />уникальность</Button>
              <div style={{ marginTop: '20px' }}>
                <ZonesList typeUnique />
              </div>
            </Jumbotron>
          </div>
        );
      case 'main':
        return (
          <Container>
            <Row>
              <Col>
                <FontAwesomeIcon icon={faAngleLeft} onClick={() => this.setState({ edit: null })} />
              </Col>
            </Row>
            <Row>
              <Col className='w-100'>
                <Input value={name} placeholder='Имя' onChange={ev => this.setState({ name: ev.target.value })} />
              </Col>
            </Row>
            <Row>
              <Col className='w-100'>
                <Button
                  className='w-100'
                  color='success'
                  disabled={!name}
                  onClick={this.onSave}
                >
                  Сохранить
                </Button>
              </Col>
            </Row>
          </Container>
        );
    }
  }
}

export default UniqueEditor;
