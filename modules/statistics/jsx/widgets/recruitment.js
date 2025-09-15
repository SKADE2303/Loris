import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {progressBarBuilder} from './helpers/progressbarBuilder';
import {useTranslation} from 'react-i18next';

import {setupCharts} from './helpers/chartBuilder';

/**
 * Recruitment - a widget containing statistics for recruitment data.
 *
 * @param  {object} props
 * @return {JSX.Element}
 */
const Recruitment = (props) => {
  const [loading, setLoading] = useState(true);
  const [showFiltersBreakdown, setShowFiltersBreakdown] = useState(false);
  const {t} = useTranslation(['statistics', 'loris']);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState(
    {
      'siteBreakdown': {
        'agerecruitment_pie': {
          title: 'Total recruitment by Age',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Age (Years)',
          options: {pie: 'pie', bar: 'bar'},
          legend: 'under',
        },
        'ethnicity_pie': {
          title: 'Ethnicity at Screening',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Ethnicity',
          options: {pie: 'pie', bar: 'bar'},
          legend: 'under',
        },
        'siterecruitment_pie': {
          title: 'Total Recruitment per Site',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Participants',
          legend: '',
          options: {pie: 'pie', bar: 'bar'},
        },
        'siterecruitment_bysex': {
          title: 'Biological sex breakdown by site',
          filters: '',
          chartType: 'bar',
          dataType: 'bar',
          legend: 'under',
          options: {bar: 'bar', pie: 'pie'},
        },
      },
    }
  );

  const showChart = (section, chartID) => {
    return props.showChart(section, chartID, chartDetails, setChartDetails);
  };

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj,
      section,
      chartDetails,
      setChartDetails);
  };

  useEffect(
    () => {
      if (json && Object.keys(json).length !== 0) {
        setupCharts(false, chartDetails).then(
          (data) => {
            setChartDetails(data);
          }
        );
        json = props.data;
        setLoading(false);
      }
    },
    [props.data]
  );

  return loading ? <Panel title={t('Recruitment',
    {ns: 'statistics'})}><Loader/></Panel> : (
    <>
      <Panel
        title={t('Recruitment', {ns: 'statistics'})}
        id='statistics_recruitment'
        onChangeView={(index) => {
          setupCharts(false, chartDetails);
        }}
        views={[
          {
            content:
            <div className='recruitment-panel' id='overall-recruitment'>
              {progressBarBuilder(json['recruitment']['overall'])}
            </div>,
            title: t('Recruitment - overall', {ns: 'statistics'}),
          },
          {
            content:
              json['recruitment']['overall'] &&
              json['recruitment']['overall']['total_recruitment'] > 0 ? (
                  <>
                    <div className="btn-group" style={{marginBottom: '10px'}}>
                      <button
                        type="button"
                        className="btn btn-default btn-xs"
                        onClick={() => setShowFiltersBreakdown((prev) => !prev)}
                      >
                        {showFiltersBreakdown ? t('Hide Filters',
                          {ns: 'statistics'}) : t('Show Filters',
                          {ns: 'statistics'})}
                      </button>
                    </div>
                    {showFiltersBreakdown && (
                      <div style={{marginTop: '15px'}}>
                        <QueryChartForm
                          Module={'statistics'}
                          name={'recruitment'}
                          id={'recruitmentSiteBreakdownForm'}
                          data={json}
                          callback={(formDataObj) => {
                            updateFilters(formDataObj, 'siteBreakdown');
                          }}
                        />
                      </div>
                    )}
                    <div className={'site-breakdown-grid'}
                      id={Object.keys(json.options.sites).length > 15
                        ? 'site-breakdown-grid-one-column'
                        : undefined
                      }>
                      {Object
                        .keys(chartDetails['siteBreakdown'])
                        .map((chartID) => (
                          <React.Fragment key={chartID}>
                            {showChart('siteBreakdown', chartID)}
                          </React.Fragment>
                        ))}
                    </div>
                  </>
                ) : (
                  <p>{t('There have been no candidates registered yet.',
                    {ns: 'statistics'})}</p>
                ),
            title: t('Recruitment - site breakdown', {ns: 'statistics'}),
            onToggleFilters: () => {
              setShowFiltersBreakdown((prev) => !prev);
            },
          },
          {
            content:
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                }}
              >
                {Object.entries(json['recruitment']).map(
                  ([key, value]) => {
                    if (key !== 'overall' && value['total_recruitment'] > 0) {
                      return <div key ={`projectBreakdown_${key}`}>
                        {progressBarBuilder(value)}
                      </div>;
                    }
                  }
                )}
              </div>,
            title: t('Recruitment - project breakdown', {ns: 'statistics'}),
          },
          {
            content:
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                }}
              >
                {Object.entries(json['recruitmentcohorts'])
                  .map(
                    ([key, value]) => {
                      return <div key={`cohortBreakdown_${key}`}>
                        {progressBarBuilder(value)}
                      </div>;
                    }
                  )}
              </div>,
            title: t('Recruitment - cohort breakdown', {ns: 'statistics'}),
          },
        ]}
      />
    </>
  );
};

Recruitment.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string,
  updateFilters: PropTypes.func,
  showChart: PropTypes.func,
};
Recruitment.defaultProps = {
  data: {},
};

export default Recruitment;
