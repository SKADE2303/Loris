import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import {Tabs, TabPane} from 'Tabs';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import IssueTrackerBatchMode from './IssueTrackerBatchMode';

import hiStrings from '../locale/hi/LC_MESSAGES/issue_tracker.json';

/**
 * Issue Tracker Index component
 */
class IssueTrackerIndex extends Component {
  /**
   * @constructor
   *
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      activeTab: 'browse',
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Called by React when the component updates.
   *
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous state
   */
  componentDidUpdate(prevProps, prevState) {
    // If the activeTab has changed to 'browse', refetch data
    if (prevState.activeTab !== 'browse' && this.state.activeTab === 'browse') {
      this.setState({isLoaded: false}, () => {
        this.fetchData()
          .then(() => this.setState({isLoaded: true}));
      });
    }
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   *
   * @return {object} 
   */
  fetchData() {
    const {t} = this.props;
    const columnMap = {
    issueID: t('Issue ID', { ns: 'issue_tracker' }),
    title: t('Title', { ns: 'loris' }),
    priority: t('Priority', { ns: 'issue_tracker' }),
    pscid: t('PSCID', { ns: 'loris' }),
    visitLabel: t('Visit Label', { ns: 'loris' }),
    };
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
      data.data = data.data.map((row) => ({
        issueID: row[columnMap.issueID] || row['IssueID'],
        title: row[columnMap.title] || row['Title'],
        priority: row[columnMap.priority] || row['Priority'],
        pscid: row[columnMap.pscid] || row['PSCID'],
        visitLabel: row[columnMap.visitLabel] || row['Visit Label'],
        ...row,
      }));
      this.setState({ data });
    })
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Handle tab changes
   *
   * @param {string} newTab - The ID of the newly selected tab
   */
  handleTabChange(newTab) {
    this.setState({activeTab: newTab});
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
    const fieldKey = this.fieldKeyMap[column] || null;
    // default
    console.log('fieldKey:', fieldKey);
    console.log('cell:', cell);
    console.log('row:', row);
    console.log('column:', column);
    let result = <td>{cell}</td>;

    if (fieldKey === 'title' && row && typeof row.Title !== 'undefined') {
      return <td><a href={`${loris.BaseURL}/issue_tracker/issue/${row.issueID}`}>{row.Title}</a></td>;
    }

    if (fieldKey === 'issueID') {
      return <td><a href={`${loris.BaseURL}/issue_tracker/issue/${cell}`}>{cell}</a></td>;
    }

    if (fieldKey === 'priority') {
      switch (String(cell)) {
      case 'normal':
        return <td style={{background: '#CCFFCC'}}>Normal</td>;
      case 'high':
        return <td style={{background: '#EEEEAA'}}>High</td>;
      case 'urgent':
        return <td style={{background: '#CC6600'}}>Urgent</td>;
      case 'immediate':
        return <td style={{background: '#E4A09E'}}>Immediate</td>;
      case 'low':
        return <td style={{background: '#99CCFF'}}>Low</td>;
      default:
        return <td>None</td>;
      }
    }

    if (fieldKey === 'site') {
      if (Array.isArray(cell) &&
        JSON.stringify(Object.keys(this.state.data.centerIDs)) === JSON.stringify(cell)
      ) {
        return <td>All Sites</td>;
      }
      if (Array.isArray(cell)) {
        return <td>{cell.map((v) => this.state.data.fieldOptions.sites[v]).filter((v) => v !== undefined).join(', ')}</td>;
      }
    }

    if (fieldKey === 'pscid' && row && row.PSCID !== null) {
      return <td><a href={`${loris.BaseURL}/${row.CandID}/`}>{cell}</a></td>;
    }

    if (fieldKey === 'visitLabel' && row && row['Visit Label'] !== null) {
      return <td><a href={`${loris.BaseURL}/instrument_list/?candID=${row.CandID}&sessionID=${row.SessionID}`}>{cell}</a></td>;
    }

    return result;
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

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in media.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {key: 'issueID', label: t('Issue ID', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'issueID',
        type: 'text',
      }},
      {key: 'title', label: t('Title', {ns: 'loris'}), show: true, filter: {
        name: 'title',
        type: 'text',
      }},
      {key: 'module', label: t('Module', {ns: 'loris'}), show: true, filter: {
        name: 'module',
        type: 'select',
        options: options.modules,
      }},
      {key: 'category', label: t('Category', {ns: 'loris'}), show: true, filter: {
        name: 'category',
        type: 'select',
        options: options.categories,
      }},
      {key: 'reporter', label: t('Reporter', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'reporter',
        type: 'select',
        options: options.reporters,
      }},
      {key: 'assignee', label: t('Assignee', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'assignee',
        type: 'select',
        options: options.assignees,
      }},
      {key: 'status', label: t('Status', {ns: 'loris'}), show: true, filter: {
        name: 'status',
        type: 'multiselect',
        options: options.statuses,
      }},
      {key: 'priority', label: t('Priority', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'priority',
        type: 'select',
        sortByValue: false,
        options: options.priorities,
      }},
      {key: 'site', label: t('Site', {ns: 'loris'}), show: true, filter: {
        name: 'site',
        type: 'multiselect',
        options: options.sites,
      }},
      {key: 'pscid', label: t('PSCID', {ns: 'loris'}), show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {key: 'visitLabel', label: t('Visit Label', {ns: 'loris'}), show: true, filter: {
        name: 'visitLabel',
        type: 'text',
      }},
      {key: 'dateCreated', label: t('Date Created', {ns: 'issue_tracker'}), show: false, filter: {
        name: 'dateCreated',
        type: 'date',
      }},
      {key: 'lastUpdate', label: t('Last Update', {ns: 'issue_tracker'}), show: true},
      {key: 'sessionID', label: t('SessionID', {ns: 'issue_tracker'}), show: false},
      {key: 'dccid', label: t('DCCID', {ns: 'loris'}), show: false},
      {key: 'watching', label: t('Watching', {ns: 'issue_tracker'}), show: false, filter: {
        name: 'watching',
        type: 'checkbox',
      }},
    ];

    // expose a stable label->key map so formatColumn can detect logical columns
    this.fieldKeyMap = {};
    fields.forEach((f) => { this.fieldKeyMap[f.label] = f.key; });

    const filterPresets = {
      all: {label: t('All Issues', {ns: 'issue_tracker'}), filter: {}},
      active: {label: t('Active Issues', {ns: 'issue_tracker'}), filter: {
        status: {
          value: ['acknowledged', 'assigned', 'feedback', 'new', 'resolved'],
        },
      }},
      closed: {label: t('Closed Issues', {ns: 'issue_tracker'}), filter: {
        status: {value: ['closed'], exactMatch: true},
      }},
    };

    // Add "My Issues" filter only if user has any issues
    if (this.state.data.userIssueCount > 0) {
      filterPresets.myIssues = {
        label: t('My Issues', {ns: 'issue_tracker'}),
        filter: {
          assignee: {
            value: this.state.data.fieldOptions.userID, exactMatch: true,
          },
          status: {
            value: ['acknowledged', 'assigned', 'feedback', 'new', 'resolved'],
          },
        },
      };
    }

    const addIssue = () => {
      window.location.replace(
        loris.BaseURL+'/issue_tracker/issue/new'
      );
    };
    const actions = [
      {label: t('New Issue', {ns: 'issue_tracker'}), action: addIssue},
    ];

    const tabList = [
      {
        id: 'browse',
        label: t('Browse Issues', {ns: 'issue_tracker'}),
      },
    ];

    // Only display the Batch mode tab if user has the required permission
    if (this.props.hasPermission('issue_tracker_all_issue')) {
      tabList.push({
        id: 'batch',
        label: t('Batch Edit', {ns: 'issue_tracker'}),
      });
    }

    return (
      <Tabs
        tabs={tabList}
        defaultTab={this.state.activeTab}
        updateURL={true}
        onTabChange={this.handleTabChange}
      >
        <TabPane TabId="browse">
          <FilterableDataTable
            name="issuesTracker"
            data={this.state.data.data}
            fields={fields}
            filterPresets={Object.values(filterPresets)}
            actions={actions}
            getFormattedCell={this.formatColumn}
          />
          <ul>
            {Object.values(filterPresets).map((preset, idx) => (
              <li key={preset.label || idx}>{preset.label}</li>
            ))}
          </ul>
        </TabPane>
        <TabPane TabId="batch">
          <IssueTrackerBatchMode
            issues={this.state.data.data}
            options={{
              priorities: this.state.data.fieldOptions.priorities,
              statuses: this.state.data.fieldOptions.statuses,
              categories: this.state.data.fieldOptions.categories,
              sites: this.state.data.fieldOptions.sites,
            }}
          />
        </TabPane>
      </Tabs>
    );
  }
}

IssueTrackerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'issue_tracker', hiStrings);

  const IssueTrackerIndexWithTranslation = withTranslation(
    ['issue_tracker', 'loris']
  )(IssueTrackerIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <IssueTrackerIndexWithTranslation
      dataURL={`${loris.BaseURL}/issue_tracker/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});
