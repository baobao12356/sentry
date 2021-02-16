import React from 'react';
import styled from '@emotion/styled';

import Button from 'app/components/button';
import ButtonBar from 'app/components/buttonBar';
import {t} from 'app/locale';
import space from 'app/styles/space';
import {ExceptionValue} from 'app/types';
import {STACK_TYPE, STACK_VIEW} from 'app/types/stacktrace';

type NotifyOptions = {
  stackView?: STACK_VIEW;
  stackType?: STACK_TYPE;
};

type Props = {
  stackView?: STACK_VIEW;
  stackType?: STACK_TYPE;
  platform?: string;
  stacktrace?: ExceptionValue['stacktrace'];
  thread?: Record<string, any>;
  exception?: Record<string, any>;
  onChange?: (notifyOptions: NotifyOptions) => void;
};

const CrashActions = ({
  stackView,
  stackType,
  stacktrace,
  thread,
  exception,
  platform,
  onChange,
}: Props) => {
  const hasSystemFrames: boolean =
    stacktrace?.hasSystemFrames ||
    thread?.stacktrace?.hasSystemFrames ||
    exception?.values.find(x => !!x?.stacktrace?.hasSystemFrames);

  const hasMinified = !stackType
    ? false
    : !!exception?.values.find(x => x.rawStacktrace) || !!thread?.rawStacktrace;

  function notify(options: NotifyOptions) {
    onChange?.(options);
  }

  return (
    <ButtonGroupWrapper>
      <ButtonBar active={stackView} merged>
        {hasSystemFrames && (
          <Button
            barId={STACK_VIEW.APP}
            size="xsmall"
            onClick={() => notify({stackView: STACK_VIEW.APP})}
          >
            {t('App Only')}
          </Button>
        )}
        <Button
          barId={STACK_VIEW.FULL}
          size="xsmall"
          onClick={() => notify({stackView: STACK_VIEW.FULL})}
        >
          {t('Full')}
        </Button>
        <Button
          barId={STACK_VIEW.RAW}
          onClick={() => notify({stackView: STACK_VIEW.RAW})}
          size="xsmall"
        >
          {t('Raw')}
        </Button>
      </ButtonBar>
      {hasMinified && (
        <ButtonBar active={stackType} merged>
          <Button
            barId={STACK_TYPE.ORIGINAL}
            size="xsmall"
            onClick={() => notify({stackType: STACK_TYPE.ORIGINAL})}
          >
            {platform === 'javascript' || platform === 'node'
              ? t('Original')
              : t('Symbolicated')}
          </Button>
          <Button
            barId={STACK_TYPE.MINIFIED}
            size="xsmall"
            onClick={() => notify({stackType: STACK_TYPE.MINIFIED})}
          >
            {platform === 'javascript' || platform === 'node'
              ? t('Minified')
              : t('Unsymbolicated')}
          </Button>
        </ButtonBar>
      )}
    </ButtonGroupWrapper>
  );
};

export default CrashActions;

const ButtonGroupWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  > * {
    padding: ${space(0.5)} 0;
  }
  > * :not(:last-child) {
    margin-right: ${space(1)};
  }
`;
