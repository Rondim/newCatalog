import React, { Component } from 'react';
import { Button, Jumbotron, Container, Row, Col, Input } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/fontawesome-free-solid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper } from 'material-ui';

import CatalogSidebar from '../CatalogSidebar';
import { notification } from '../Notificator/actions';
import { instanceByFilter } from './queries/utils/fetchInstancesCount';
import { compose, graphql } from 'react-apollo/index';
import createZone from './mutations/createZone.graphql';
import refreshZone from './mutations/refreshZone.graphql';
import query from './queries/fetchCells.graphql';
import PadsList from './PadsList';

@connect(null, { notification })
@compose(
  graphql(createZone, { name: 'createZone' }),
  graphql(refreshZone, { name: 'refreshZone' }),
)
class PadEditor extends Component {
  static propTypes = {
    cells: PropTypes.object,
    sheet: PropTypes.string,
    notification: PropTypes.func,
    classes: PropTypes.string,
    config: PropTypes.object,
    filters: PropTypes.object,
    createZone: PropTypes.func,
    refreshZone: PropTypes.func
  };
  static defaultProps = {};

  state={
    edit: null,
    name: '',
    type: 'Loader',
    filters: null
  };

  onEdit = () => {
    const { cells, notification } = this.props;
    if (cells) {
      this.setState({ edit: 'main' });
    } else {
      notification('warning', 'Область не выбрана');
    }
  };

  closeFilterSelector = () => {
    const { filters } = this.props;
    this.setState({ edit: 'main', filters });
  };

  resetFilterSelector = () => {
    this.setState({ edit: 'main', filters: null });
  };

  switchType = () => {
    this.setState(({ type }) => {
      switch (type) {
        case 'Loader':
          return { type: 'Pad' };
        case 'Pad':
          return { type: 'Loader' };
      }
    });
  };

  onSave = async () => {
    const { config, sheet, cells } = this.props;
    const { name, filters, type } = this.state;
    const filter = instanceByFilter(filters, config.mapTypes);
    const res = await this.props.createZone({
      variables: { ...cells, filter, sheet, name, type }
    });
    await this.props.refreshZone({
      variables: { zoneId: res.data.createZone.id, sheetId: sheet },
      refetchQueries: [{ query, variables: { sheet } }]
    });
  };

  render() {
    const { edit, name, filters, type } = this.state;
    const { classes, config } = this.props;
    if (filters) config.filtersSelected = filters;
    switch (edit) {
      case null:
        return (
          <div>
            <Jumbotron>
              <Button className='w-100' onClick={this.onEdit}>Создать зону</Button>
              <div style={{ marginTop: '20px' }}>
                <PadsList />
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
                <Button className='w-100' onClick={() => this.setState({ edit: 'filtersSelector' })}>
                  {filters ? 'Изменить loader' : 'Добавить loader'}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className='w-100'>
                <Button className='w-100' onClick={this.switchType}>
                  {type === 'Loader' ? 'Сделать планшеткой' : 'Удалить планшетку'}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className='w-100'>
                <Button
                  className='w-100'
                  color='success'
                  disabled={!name || !filters && type !== 'Pad'}
                  onClick={this.onSave}
                >
                  Сохранить
                </Button>
              </Col>
            </Row>
          </Container>
        );
      case 'filtersSelector':
        return (
          <Paper className={classes}>
            <Row>
              <Col>
                <FontAwesomeIcon icon={faAngleLeft} onClick={this.closeFilterSelector} />
              </Col>
            </Row>
            <CatalogSidebar config={config} />
            <Button color='danger' onClick={this.resetFilterSelector}>Удалить Loader</Button>
          </Paper>
        );
    }
  }
}

export default PadEditor;
