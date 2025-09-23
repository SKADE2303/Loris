import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import InstrumentUploadForm from './uploadForm';

import Modal from 'jsx/Modal';
import InfoPanel from 'jsx/InfoPanel';

import Select from 'react-select';
import swal from 'sweetalert2';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/instrument_manager.json';
/**
 * Instrument Manager Index component
 */
class InstrumentManagerIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      modifyPermissions: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
      });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    const {t} = this.props;
    if (column === t('Permission Required', {ns: 'instrument_manager'})) {
      const clickHandler = (row) => {
        return () => {
          this.setState({
            'modifyPermissions': {
              'instrument': row.Instrument,
              'permissions': row[t('Permission Required',
                {ns: 'instrument_manager'})],
            },
          });
        };
      };
      return (
        <td>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {
              cell == null
                ? t('No Permissions enforced.',
                  {ns: 'instrument_manager'})
                : cell.join(',')
            }
            {
              this.props.hasPermission('instrument_manager_write') && (
                <button
                  className='btn btn-primary'
                  style={{marginTop: '5px'}}
                  onClick={clickHandler(row)}
                >
                  {cell == null ? t('Add Permissions',
                    {ns: 'instrument_manager'}) : t('Modify Permissions',
                    {ns: 'instrument_manager'})}
                </button>
              )
            }
          </div>
        </td>
      );
    }
    return (
      <td>{cell}</td>
    );
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const fields = [
      {label: t('Instrument', {ns: 'instrument_manager'}),
        show: true, filter: {
          name: 'instrument',
          type: 'text',
        }},
      {label: t('Instrument Type', {ns: 'instrument_manager'}),
        show: true, filter: {
          name: 'instrumentType',
          type: 'select',
          options: {
            [t('Instrument Builder', {ns: 'instrument_manager'})]:
           t('Instrument Builder', {ns: 'instrument_manager'}),
            [t('PHP', {ns: 'instrument_manager'})]:
           t('PHP', {ns: 'instrument_manager'}),
            [t('Missing', {ns: 'loris'})]: t('Missing', {ns: 'loris'}),
          },
        }},
      {label: t('Table Installed', {ns: 'instrument_manager'}),
        show: true, filter: {
          name: 'tableInstalled',
          type: 'select',
          options: {
            [t('Exists', {ns: 'instrument_manager'})]: t('Exists',
              {ns: 'instrument_manager'}),
            [t('Missing', {ns: 'loris'})]: t('Missing', {ns: 'loris'}),
          },
        }},
      {label: t('Table Valid', {ns: 'instrument_manager'}),
        show: true, filter: {
          name: 'tableValid',
          type: 'text',
        }},
      {label: t('Pages Valid', {ns: 'instrument_manager'}),
        show: true, filter: {
          name: 'pagesValid',
          type: 'text',
        }},
      {label: t('Permission Required', {ns: 'instrument_manager'}),
        show: true, filter: {
          name: 'permissionsRequired',
          type: 'text',
        }},
    ];

    const tabs = [
      {id: 'browse', label: t('Browse', {ns: 'instrument_manager'})},
    ];

    let permsModal = null;
    if (this.state.modifyPermissions !== false) {
      const submitPromise = () => {
        return new Promise(
          (resolve, reject) => {
            fetch(
              this.props.BaseURL + '/instrument_manager/permissions',
              {
                method: 'POST',
                body: JSON.stringify(this.state.modifyPermissions),
              }).then((response) => {
              if (!response.ok) {
                console.error(response.status);
                throw new Error('Could not modify permissions');
              }
              return response.json();
            }).then( (data) => {
              resolve();
              this.fetchData();
            }).catch((message) => {
              swal.fire({
                title: t('Oops..', {ns: 'instrument_manager'}),
                text: t('Something went wrong!', {ns: 'instrument_manager'}),
                type: 'error',
              });
              reject();
            });
          });
      };

      permsModal = (<Modal
        title={t('Edit Permissions for', {ns: 'instrument_manager'}) + ' '
                + this.state.modifyPermissions.instrument}
        show={true}
        onSubmit={submitPromise}
        onClose={
          () => {
            this.setState({'modifyPermissions': false});
          }
        }>
        <p>{t('Select the permissions required for accessing',
          {ns: 'instrument_manager'})}&nbsp;
        {this.state.modifyPermissions.instrument}
        {t('in the dropdown below.', {ns: 'instrument_manager'})}
        </p>
        <p>{t('Any user accessing the instrument (either for viewing the data '
        +'or data entry) must have one of the access permissions selected.',
        {ns: 'instrument_manager'})}
        </p>
        <InfoPanel>
          {t('A user with <em>any</em> of the selected permissions will '
          +'be able to access', {ns: 'instrument_manager'})}
          &nbsp;{this.state.modifyPermissions.instrument}.
          {t('If no permissions are selected, the default'+
            ' LORIS permissions will be enforced for this instrument.',
          {ns: 'instrument_manager'})}
        </InfoPanel>

        <PermissionSelect
          codes={this.state.data.fieldOptions.allPermissionCodes}
          selected={this.state.modifyPermissions.permissions}
          instrument={this.state.modifyPermissions.instrument}
          modifySelected={(newselected) => {
            let modifyPermissions = {...this.state.modifyPermissions};
            modifyPermissions.permissions = newselected;
            this.setState({modifyPermissions});
          }}
        />
      </Modal>);
    }
    if (this.props.hasPermission('instrument_manager_write')) {
      tabs.push({id: 'upload', label: t('Upload', {ns: 'instrument_manager'})});
    }

    const feedback = () => {
      if (!this.state.data.fieldOptions.caninstall
        && this.props.hasPermission('instrument_manager_write')) {
        return (
          <div className='alert alert-warning'>
            {t('Instrument installation is not possible given the'
            +' current server configuration; the LORIS \'adminUser\' is not'
              +' configured properly. File upload is still possible but '
              +'instruments will need to be installed manually',
            {ns: 'instrument_manager'})}
          </div>
        );
      }
    };

    const uploadTab = () => {
      let content = null;
      if (!this.props.hasPermission('instrument_manager_write')) {
        content = (
          <div className='alert alert-warning'>
            {t('You do not have access to this page.', {ns: 'loris'})}
          </div>
        );
      } else if (this.state.data.fieldOptions.writable) {
        let url = loris.BaseURL.concat('/instrument_manager/');
        content = (
          <InstrumentUploadForm action={url}/>
        );
      } else {
        content = (
          <div className='alert alert-warning'>
            {t('Installation is not possible given the current server '
              +'configuration. Please contact your administrator if you '
              +'require this functionality', {ns: 'instrument_manager'})}
          </div>
        );
      }
      return content;
    };

    return (
      <Tabs tabs={tabs} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabs[0].id}>
          {permsModal}
          <FilterableDataTable
            name="instrument_manager"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        <TabPane TabId='upload'>
          {feedback()}
          {uploadTab()}
        </TabPane>
      </Tabs>
    );
  }
}

InstrumentManagerIndex.propTypes = {
  BaseURL: PropTypes.string,
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func,
};

/**
 * Create a componenet to select permissions from a list of available
 * permissions.
 *
 * @param {object} props - react props
 * @return {JSX}
 */
function PermissionSelect(props) {
  const options = props.codes.map((val) => {
    return {value: val, label: val};
  });
  const values = options.filter((row) => {
    if (props.selected == null) {
      // nothing selected, filter everything
      return false;
    }
    return props.selected.includes(row.value);
  });
  return <Select
    isMulti={true}
    options={options}
    value={values}
    onChange={(newValue) => {
      props.modifySelected(newValue.map((row) => row.value));
    }}
  />;
}

PermissionSelect.propTypes = {
  codes: PropTypes.array,
  selected: PropTypes.array,
  modifySelected: PropTypes.func,
};

const TranslatedInstrumentManagerIndex = withTranslation(
  ['instrument_manager', 'loris'])(InstrumentManagerIndex);

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'instrument_manager', hiStrings);

  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <TranslatedInstrumentManagerIndex
      BaseURL={loris.BaseURL}
      dataURL={`${loris.BaseURL}/instrument_manager/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});
