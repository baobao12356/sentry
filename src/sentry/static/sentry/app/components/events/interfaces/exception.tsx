import React from 'react';

import EventDataSection from 'app/components/events/eventDataSection';
import CrashContent from 'app/components/events/interfaces/crashContent';
import CrashActions from 'app/components/events/interfaces/crashHeader/crashActions';
import CrashTitle from 'app/components/events/interfaces/crashHeader/crashTitle';
import {isStacktraceNewestFirst} from 'app/components/events/interfaces/stacktrace';
import {t} from 'app/locale';
import {ExceptionType} from 'app/types';
import {Event} from 'app/types/event';
import {STACK_TYPE, STACK_VIEW} from 'app/types/stacktrace';
import {defined} from 'app/utils';

import findBestThread from './threads/threadSelector/findBestThread';
import getThreadException from './threads/threadSelector/getThreadException';
import getThreadStacktrace from './threads/threadSelector/getThreadStacktrace';

const defaultProps = {
  hideGuide: false,
};

type Props = {
  event: Event;
  type: string;
  data: ExceptionType;
  projectId: string;
} & typeof defaultProps;

type State = {
  stackView: STACK_VIEW;
  stackType: STACK_TYPE;
  newestFirst: boolean;
};

class Exception extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  state: State = {
    stackView: this.props.data.hasSystemFrames ? STACK_VIEW.APP : STACK_VIEW.FULL,
    newestFirst: isStacktraceNewestFirst(),
    stackType: STACK_TYPE.ORIGINAL,
  };

  handleChange = (newState: Partial<State>) => {
    this.setState(prevState => ({
      ...prevState,
      ...newState,
    }));
  };

  render() {
    const {event, projectId, data, hideGuide, type} = this.props;
    const {entries} = event;
    const threadEntry = entries.find(entry => entry.type === 'threads');

    if (threadEntry) {
      const threads = threadEntry.data.values;
      const bestThread = defined(threads) ? findBestThread(threads) : undefined;
      const threadException = getThreadException(event, bestThread);
      const threadStacktrace = getThreadStacktrace(event, false, bestThread);
      const hasMissingStacktrace = !(threadException || threadStacktrace);

      // In case there are threads in the event data and there is no missing stacktrace, we don't render the
      // exception block.  Instead the exception is contained within the thread interface.
      if (!hasMissingStacktrace) {
        return null;
      }
    }

    const {stackView, stackType, newestFirst} = this.state;

    const commonCrashHeaderProps = {
      newestFirst,
      hideGuide,
      onChange: this.handleChange,
    };

    return (
      <EventDataSection
        type={type}
        title={<CrashTitle title={t('Exception')} {...commonCrashHeaderProps} />}
        actions={
          <CrashActions
            stackType={stackType}
            stackView={stackView}
            platform={event.platform}
            exception={data}
            {...commonCrashHeaderProps}
          />
        }
        wrapTitle={false}
      >
        <CrashContent
          projectId={projectId}
          event={event}
          stackType={stackType}
          stackView={stackView}
          newestFirst={newestFirst}
          exception={data}
        />
      </EventDataSection>
    );
  }
}

export default Exception;
