import {ExceptionValue} from 'app/types';
import {Event} from 'app/types/event';
import {Thread} from 'app/types/events';
import {defined} from 'app/utils';

import getThreadException from './getThreadException';

function getThreadStacktrace(event: Event, raw: boolean, thread?: Thread) {
  const exc = getThreadException(event, thread);

  if (exc) {
    if (exc.values.length === 1 && !defined(exc.values[0].threadId)) {
      return exc.values[0].stacktrace;
    }

    if (!thread) {
      return undefined;
    }

    let rv: ExceptionValue['stacktrace'] | undefined = undefined;

    for (const singleExc of exc.values) {
      if (singleExc.threadId === thread.id) {
        rv = singleExc.stacktrace;
        if (raw && singleExc.rawStacktrace) {
          rv = singleExc.rawStacktrace;
        }
      }
    }

    return rv;
  }

  if (raw && thread?.rawStacktrace) {
    return thread.rawStacktrace;
  }

  if (thread?.stacktrace) {
    return thread.stacktrace;
  }

  return undefined;
}

export default getThreadStacktrace;
