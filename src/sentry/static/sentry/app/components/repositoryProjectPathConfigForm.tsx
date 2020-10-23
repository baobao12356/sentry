import React from 'react';
import styled from '@emotion/styled';
import {components} from 'react-select';

import {Client} from 'app/api';
import {t} from 'app/locale';
import Access from 'app/components/acl/access';
import Button from 'app/components/button';
import Confirm from 'app/components/confirm';
import {IconDelete, IconEdit} from 'app/icons';
import QuestionTooltip from 'app/components/questionTooltip';
import space from 'app/styles/space';
import Tooltip from 'app/components/tooltip';
import IdBadge from 'app/components/idBadge';
import Form from 'app/views/settings/components/forms/form';
import JsonForm from 'app/views/settings/components/forms/jsonForm';
import {Project, Organization, Integration, Repository} from 'app/types';
import {JsonFormObject} from 'app/views/settings/components/forms/type';

type Props = {
  organization: Organization;
  integration: Integration;
  projects: Project[];
  repos: Repository[];
};

export default class RepositoryProjectPathConfigForm extends React.Component<Props> {
  api = new Client();

  get initialData() {
    return {
      branch: 'master',
    };
  }

  get formFields(): JsonFormObject {
    const {projects, repos} = this.props;
    const repoChoices = repos.map(({name, id}) => ({value: id, label: name}));
    return {
      title: t('Create Code Path'),
      fields: [
        {
          name: 'project',
          type: 'sentry_project_selector',
          required: true,
          label: t('Project'),
          inline: false,
          projects,
        },
        {
          name: 'repo',
          type: 'select',
          required: true,
          label: t('Repo'),
          inline: false,
          placeholder: t('Choose repo'),
          options: repoChoices,
        },
        {
          name: 'branch',
          type: 'string',
          required: true,
          label: t('Branch'),
          placeholder: t('Type your branch'),
          inline: false,
        },
        {
          name: 'stackRoot',
          type: 'string',
          required: false,
          label: t('Input Path'),
          placeholder: t('Type root path of your stack traces'),
          inline: false,
        },
        {
          name: 'sourceRoot',
          type: 'string',
          required: false,
          label: t('Output Path'),
          placeholder: t('Type root path of your source code'),
          inline: false,
        },
      ],
    };
  }

  render() {
    const {organization, integration} = this.props;
    const endpoint = `/organizations/${organization.slug}/integrations/${integration.id}/repo-project-path-configs/`;

    return (
      <StyledForm initialData={this.initialData} apiEndpoint={endpoint} apiMethod="POST">
        <JsonForm forms={[this.formFields]} />
      </StyledForm>
    );
  }
}

const StyledForm = styled(Form)`
  label {
    color: ${p => p.theme.gray600};
    font-family: Rubik;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }
`;