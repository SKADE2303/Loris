import React from 'react';
import {useTranslation} from 'react-i18next';

/**
 * progressBarBuilder - generates the graph content.
 *
 * @param  {object} data - data needed to generate the graph content.
 * @return {JSX.Element} the charts to render to the widget panel.
 */
const progressBarBuilder = (data) => {
  const {t} = useTranslation(['statistics', 'loris']);

  let title;
  let content;
  title = <h5>
    {data['title']}
  </h5>;
  if (data['surpassed_recruitment']) {
    content = (
      <div>
        <div className='progress'>
          <div className='progress-bar progress-bar-female'
            role='progressbar'
            style={{width: `${data['female_full_percent']}%`}}
            data-toggle='tooltip'
            data-placement='bottom'
            title={`${data['female_full_percent']}% female`}>
            <p>
              {data['female_total']}<br/>{t('Females', {ns: 'statistics'})}
            </p>
          </div>
          <div className='progress-bar progress-bar-male'
            data-toggle='tooltip'
            data-placement='bottom'
            role='progressbar'
            style={{width: `${data['male_full_percent']}%`}}
            title={`${data['male_full_percent']}% male`}>
            <p>
              {data['male_total']}<br/>{t('Males', {ns: 'statistics'})}
            </p>
          </div>
          {
            data['non_binary_percent'] &&
                <div className='progress-bar progress-bar-other'
                  data-toggle='tooltip'
                  data-placement='bottom'
                  role='progressbar'
                  style={{width: `${data['non_binary_percent']}%`}}
                  title={`${data['non_binary_percent']}% other`}>
                  <p>
                    {data['non_binary_total']}<br/>{t('Other',
                       {ns: 'statistics'})}
                  </p>
                </div>
          }
          <p className='pull-right small target'>
            {t('Target', {ns: 'statistics'})}: {data['recruitment_target']}
          </p>
        </div>
        {
          data['recruitment_target'] &&
            <small>
              {t('Recruitment target of %s was reached.',
                 {ns: 'statistics'}).replace('%s', data['recruitment_target'])}
              {' '}{t('total participants.', {ns: 'statistics'})}
            </small>
        }
      </div>
    );
  } else {
    content = (
      <>
        <div className='progress'>
          <div className='progress-bar progress-bar-female'
            role='progressbar'
            style={{width: `${data['female_percent']}%`}}
            data-toggle='tooltip'
            data-placement='bottom'
            title={`${data['female_percent']}% female`}>
            <p>
              {data['female_total']}<br/>{t('Females', {ns: 'statistics'})}
            </p>
          </div>
          <div className='progress-bar progress-bar-male'
            data-toggle='tooltip'
            data-placement='bottom'
            role='progressbar'
            style={{width: `${data['male_percent']}%`}}
            title={`${data['male_percent']}% male`}>
            <p>
              {data['male_total']}<br/>{t('Males', {ns: 'statistics'})}
            </p>
          </div>
          {
            data['non_binary_percent'] &&
                <div className='progress-bar progress-bar-other'
                  data-toggle='tooltip'
                  data-placement='bottom'
                  role='progressbar'
                  style={{width: `${data['non_binary_percent']}%`}}
                  title={`${data['non_binary_percent']}% other`}>
                  <p>
                    {data['non_binary_total']}<br/>{t('Other',
                       {ns: 'statistics'})}
                  </p>
                </div>
          }
          {
            data['recruitment_target'] &&
                <p className='pull-right small target'>
                  {t('Target', 
                    {ns: 'statistics'})}: {data['recruitment_target']}
                </p>
          }
        </div>
        {
          data['recruitment_target'] &&
            <small>
              {t('Recruitment target of %s not reached.',
                 {ns: 'statistics'}).replace('%s', data['recruitment_target'])}
              {' '}{t('total participants.', {ns: 'statistics'})}
            </small>
        }
      </>
    );
  }
  return (
    <>
      {title}
      {content}
    </>
  );
};

export {
  progressBarBuilder,
};
