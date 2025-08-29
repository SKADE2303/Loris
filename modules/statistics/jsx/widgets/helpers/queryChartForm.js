import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SelectElement, FormElement, ButtonElement} from 'jsx/Form';
import {useTranslation} from 'react-i18next';
<<<<<<< HEAD

=======
>>>>>>> 463cfe75b (Add translation)

/**
 * QueryChartForm - a form used for statistics query to modify graphs/charts.
 *
 * @param  {object} props
 * @return {JSX.Element}
 */
const QueryChartForm = (props) => {
  const [optionsProjects, setOptionsProjects] = useState({});
  const [optionsCohorts, setOptionsCohorts] = useState({});
  const [optionsSites, setOptionsSites] = useState({});
  const [optionsVisits, setOptionsVisits] = useState({});
  const [optionsStatus, setOptionsStatus] = useState({});
  const [formDataObj, setFormDataObj] = useState({});
<<<<<<< HEAD
  const {t} = useTranslation();
=======
  const {t} = useTranslation(['statistics', 'loris']);
>>>>>>> 463cfe75b (Add translation)

  /**
   * useEffect - modified to run when props.data updates.
   */
  useEffect(
    () => {
      const json = props.data;
      if (json && Object.keys(json).length !== 0) {
        let projectOptions = {};
        for (const [key, value] of
          Object.entries(json['options']['projects'])) {
          projectOptions[key] = value;
        }
        setOptionsProjects(projectOptions);
        let cohortOptions = {};
        for (
          const [key, value] of Object.entries(json['options']['cohorts'])
        ) {
          cohortOptions[key] = value;
        }
        setOptionsCohorts(cohortOptions);
        let siteOptions = {};
        for (const [key, value] of Object.entries(json['options']['sites'])) {
          siteOptions[key] = value;
        }
        setOptionsSites(siteOptions);
        let visitOptions = {};
        for (const [key, value] of Object.entries(json['options']['visits'])) {
          visitOptions[key] = value;
        }
        setOptionsVisits(visitOptions);
        let participantStatusOptions = {};
        for (const [key, value] of Object.entries(
          json['options']['participantStatus']
        )) {
          participantStatusOptions[key] = value;
        }
        setOptionsStatus(participantStatusOptions);
      }
    },
    [props.data]
  );

  /**
   * setFormData - Stores the value of the element in formDataObj state.
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  const setFormData = (formElement, value) => {
    // Normalize single selection into array (in case)
    const normalizedValue = Array.isArray(value) ? value : [value];

    setFormDataObj(
      (prevState) => {
        const newFormData = {
          ...prevState,
          [formElement]: normalizedValue.length > 0
            ?normalizedValue : undefined,
        };
        props.callback(newFormData);
        return newFormData;
      }
    );
  };

  const resetFilters = () => {
    setFormDataObj({});
  };

  const clearSelection = t('-- Clear Selection --', {ns: 'statistics'});
  /**
   * Renders the React component.
   *
   * @param name
   * @param value
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <FormElement
      Module={props.Module}
      name={props.name}
      id={props.id}
      onSubmit={() => props.callback(formDataObj)}
      method='GET'
    >
      <div className="filter-grid">
        {/* Project Section */}
        {Object.keys(props.data['options']['projects']).length > 0 && (
          <div>
            <label style={{fontWeight: 'bold',
              marginBottom: '5px', display: 'block'}}>
              {t('Project', {ns: 'loris'})}</label>
            <SelectElement
              name='selectedProjects'
              options={{__clear__: t('-- Clear Selection --', {ns: 'statistics'}),
                ...optionsProjects}}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedProjects']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Cohort Section */}
        {Object.keys(props.data['options']['cohorts']).length > 0 && (
          <div>
            <label style={{fontWeight: 'bold',
              marginBottom: '5px',
              display: 'block'}}>{t('Cohort', {ns: 'loris'})}</label>
            <SelectElement
<<<<<<< HEAD
              name ='selectedCohorts'
              options ={{__clear__: clearSelection,
=======
              name='selectedCohorts'
              options={{__clear__: t('-- Clear Selection --', {ns: 'statistics'}),
>>>>>>> 463cfe75b (Add translation)
                ...optionsCohorts}}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedCohorts']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Site Section */}
        {Object.keys(props.data['options']['sites']).length > 0 && (
          <div>
            <label style={{fontWeight: 'bold',
              marginBottom: '5px',
              display: 'block'}}>{t('Site', {ns: 'loris'})}</label>
            <SelectElement
<<<<<<< HEAD
              name ='selectedSites'
              options ={{__clear__: clearSelection, ...optionsSites}}
              multiple ={true}
              emptyOption ={false}
              value ={formDataObj['selectedSites']}
              onUserInput ={(name, value) => {
=======
              name='selectedSites'
              options={{__clear__: t('-- Clear Selection --', {ns: 'statistics'}), ...optionsSites}}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedSites']}
              onUserInput={(name, value) => {
>>>>>>> 463cfe75b (Add translation)
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Visit Section */}
        {Object.keys(props.data['options']['visits']).length > 0 && (
          <div>
            <label style={{fontWeight: 'bold',
              marginBottom: '5px',
              display: 'block'}}>{t('Visit', {ns: 'loris'})}</label>
            <SelectElement
<<<<<<< HEAD
              name ='selectedVisits'
              options ={{__clear__: clearSelection,
=======
              name='selectedVisits'
              options={{__clear__: t('-- Clear Selection --', {ns: 'statistics'}),
>>>>>>> 463cfe75b (Add translation)
                ...optionsVisits}}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedVisits']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Status Section */}
        {Object.keys(props.data['options']['participantStatus']).length > 0
        && (
          <div>
            <label style={{fontWeight: 'bold',
              marginBottom: '5px',
<<<<<<< HEAD
              display: 'block'}}>
              {t('Participant Status', {ns: 'loris'})}
            </label>
            <SelectElement
              name ='selectedParticipantStatus'
              options ={{__clear__: clearSelection,
=======
              display: 'block'}}>{t('Status', {ns: 'loris'})}</label>
            <SelectElement
              name='selectedParticipantStatus'
              options={{__clear__: t('-- Clear Selection --', {ns: 'statistics'}),
>>>>>>> 463cfe75b (Add translation)
                ...optionsStatus}}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedParticipantStatus']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div style={{display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'}}>
        <ButtonElement
<<<<<<< HEAD
          label={t('Clear Filters', {ns: 'loris'})}
          onUserInput ={resetFilters}
          buttonClass ='btn btn-sm btn-primary'
=======
          label={t('Clear Filters', {ns: 'statistics'})}
          onUserInput={resetFilters}
          buttonClass='btn btn-sm btn-primary'
>>>>>>> 463cfe75b (Add translation)
        />
      </div>
    </FormElement>
  );
};
QueryChartForm.propTypes = {
  data: PropTypes.object,
  callback: PropTypes.func,
  Module: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
};
QueryChartForm.defaultProps = {
  data: {},
};

export {
  QueryChartForm,
};
