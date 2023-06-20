// @ts-nocheck
'use strict';

// https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379091887

// TODO: replace in v5 with:
// export type IndexByType<T extends { type: string }> = { [E in T as E['type']]: E; };

/**
 * The full definition of an event, with a string `type`.
 */

// TODO: do not accept machines without all implementations
// we should also accept a raw machine as actor logic here
// or just make machine actor logic

// TODO: narrow this to logic from machine

// TODO: fix last param

/**
 * Extracts action objects that have no extra properties.
 */

/**
 * The string or object representing the state value relative to the parent state node.
 *
 * - For a child atomic state node, this is a string, e.g., `"pending"`.
 * - For complex state nodes, this is an object, e.g., `{ success: "someChildState" }`.
 */

// TODO: remove once TS fixes this type-widening issue

// TODO: possibly refactor this somehow, use even a simpler type, and maybe even make `machine.options` private or something

let ActionTypes = /*#__PURE__*/function (ActionTypes) {
  ActionTypes["Stop"] = "xstate.stop";
  ActionTypes["Raise"] = "xstate.raise";
  ActionTypes["Send"] = "xstate.send";
  ActionTypes["Cancel"] = "xstate.cancel";
  ActionTypes["Assign"] = "xstate.assign";
  ActionTypes["After"] = "xstate.after";
  ActionTypes["DoneState"] = "done.state";
  ActionTypes["DoneInvoke"] = "done.invoke";
  ActionTypes["Log"] = "xstate.log";
  ActionTypes["Init"] = "xstate.init";
  ActionTypes["Invoke"] = "xstate.invoke";
  ActionTypes["ErrorExecution"] = "error.execution";
  ActionTypes["ErrorCommunication"] = "error.communication";
  ActionTypes["ErrorPlatform"] = "error.platform";
  ActionTypes["ErrorCustom"] = "xstate.error";
  ActionTypes["Pure"] = "xstate.pure";
  ActionTypes["Choose"] = "xstate.choose";
  return ActionTypes;
}({});
let SpecialTargets = /*#__PURE__*/function (SpecialTargets) {
  SpecialTargets["Parent"] = "#_parent";
  SpecialTargets["Internal"] = "#_internal";
  return SpecialTargets;
}({});

// xstate-specific action types
const stop$1 = ActionTypes.Stop;
const raise$1 = ActionTypes.Raise;
const send$1 = ActionTypes.Send;
const cancel$1 = ActionTypes.Cancel;
const assign$1 = ActionTypes.Assign;
const after$1 = ActionTypes.After;
const doneState = ActionTypes.DoneState;
const log$1 = ActionTypes.Log;
const init = ActionTypes.Init;
const invoke$1 = ActionTypes.Invoke;
const errorExecution = ActionTypes.ErrorExecution;
const errorPlatform = ActionTypes.ErrorPlatform;
const error$1 = ActionTypes.ErrorCustom;
const choose$1 = ActionTypes.Choose;
const pure$1 = ActionTypes.Pure;

var actionTypes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  stop: stop$1,
  raise: raise$1,
  send: send$1,
  cancel: cancel$1,
  assign: assign$1,
  after: after$1,
  doneState: doneState,
  log: log$1,
  init: init,
  invoke: invoke$1,
  errorExecution: errorExecution,
  errorPlatform: errorPlatform,
  error: error$1,
  choose: choose$1,
  pure: pure$1
});

const STATE_DELIMITER = '.';
const TARGETLESS_KEY = '';
const NULL_EVENT = '';
const STATE_IDENTIFIER = '#';
const WILDCARD = '*';

function matchesState(parentStateId, childStateId, delimiter = STATE_DELIMITER) {
  const parentStateValue = toStateValue(parentStateId, delimiter);
  const childStateValue = toStateValue(childStateId, delimiter);
  if (isString(childStateValue)) {
    if (isString(parentStateValue)) {
      return childStateValue === parentStateValue;
    }

    // Parent more specific than child
    return false;
  }
  if (isString(parentStateValue)) {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every(key => {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function toStatePath(stateId, delimiter) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }
    return stateId.toString().split(delimiter);
  } catch (e) {
    throw new Error(`'${stateId}' is not a valid state path.`);
  }
}
function isStateLike(state) {
  return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state;
}
function toStateValue(stateValue, delimiter) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }
  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }
  if (typeof stateValue !== 'string') {
    return stateValue;
  }
  const statePath = toStatePath(stateValue, delimiter);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  const value = {};
  let marker = value;
  for (let i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      marker[statePath[i]] = {};
      marker = marker[statePath[i]];
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  const result = {};
  const collectionKeys = Object.keys(collection);
  for (let i = 0; i < collectionKeys.length; i++) {
    const key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }
  return result;
}
function flatten(array) {
  return [].concat(...array);
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }
  return [value];
}
function toArray(value) {
  if (value === undefined) {
    return [];
  }
  return toArrayStrict(value);
}
function mapContext(mapper, context, event) {
  if (isFunction(mapper)) {
    return mapper({
      context,
      event
    });
  }
  const result = {};
  const args = {
    context,
    event
  };
  for (const key of Object.keys(mapper)) {
    const subMapper = mapper[key];
    if (isFunction(subMapper)) {
      result[key] = subMapper(args);
    } else {
      result[key] = subMapper;
    }
  }
  return result;
}
function isPromiseLike(value) {
  if (value instanceof Promise) {
    return true;
  }
  // Check if shape matches the Promise/A+ specification for a "thenable".
  if (value !== null && (isFunction(value) || typeof value === 'object') && isFunction(value.then)) {
    return true;
  }
  return false;
}
function isArray(value) {
  return Array.isArray(value);
}

// tslint:disable-next-line:ban-types
function isFunction(value) {
  return typeof value === 'function';
}
function isString(value) {
  return typeof value === 'string';
}
function isErrorEvent(event) {
  return typeof event.type === 'string' && (event.type === errorExecution || event.type.startsWith(errorPlatform));
}
function toTransitionConfigArray(event, configLike) {
  const transitions = toArrayStrict(configLike).map(transitionLike => {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string') {
      return {
        target: transitionLike,
        event
      };
    }
    return {
      ...transitionLike,
      event
    };
  });
  return transitions;
}
function normalizeTarget(target) {
  if (target === undefined || target === TARGETLESS_KEY) {
    return undefined;
  }
  return toArray(target);
}
function toInvokeConfig(invocable, id) {
  if (typeof invocable === 'object') {
    if ('src' in invocable) {
      return invocable;
    }
    if ('transition' in invocable) {
      return {
        id,
        src: invocable
      };
    }
  }
  return {
    id,
    src: invocable
  };
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  const noop = () => {};
  const isObserver = typeof nextHandler === 'object';
  const self = isObserver ? nextHandler : null;
  return {
    next: ((isObserver ? nextHandler.next : nextHandler) || noop).bind(self),
    error: ((isObserver ? nextHandler.error : errorHandler) || noop).bind(self),
    complete: ((isObserver ? nextHandler.complete : completionHandler) || noop).bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return `${stateNodeId}:invocation[${index}]`;
}
function resolveReferencedActor(referenced) {
  return referenced ? 'transition' in referenced ? {
    src: referenced,
    input: undefined
  } : referenced : undefined;
}

function createDynamicAction(action, resolve) {
  return {
    type: action.type,
    params: action.params,
    resolve
  };
}
function isDynamicAction(action) {
  return typeof action === 'object' && action !== null && 'resolve' in action;
}

/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @deprecated Use the `sendTo(...)` action creator instead.
 *
 * @param eventOrExpr The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */
function send(eventOrExpr, options) {
  return createDynamicAction({
    type: send$1,
    params: {
      to: options ? options.to : undefined,
      delay: options ? options.delay : undefined,
      event: eventOrExpr,
      id: options && options.id !== undefined ? options.id : isFunction(eventOrExpr) ? eventOrExpr.name : eventOrExpr.type
    }
  }, (event, {
    actorContext,
    state
  }) => {
    const params = {
      to: options ? options.to : undefined,
      delay: options ? options.delay : undefined,
      event: eventOrExpr,
      // TODO: don't auto-generate IDs here like that
      // there is too big chance of the ID collision
      id: options && options.id !== undefined ? options.id : isFunction(eventOrExpr) ? eventOrExpr.name : eventOrExpr.type
    };
    const args = {
      context: state.context,
      event,
      self: actorContext?.self ?? null,
      system: actorContext?.system
    };
    const delaysMap = state.machine.options.delays;

    // TODO: helper function for resolving Expr
    if (typeof eventOrExpr === 'string') {
      throw new Error(`Only event objects may be used with sendTo; use sendTo({ type: "${eventOrExpr}" }) instead`);
    }
    const resolvedEvent = isFunction(eventOrExpr) ? eventOrExpr(args) : eventOrExpr;
    let resolvedDelay;
    if (isString(params.delay)) {
      const configDelay = delaysMap && delaysMap[params.delay];
      resolvedDelay = isFunction(configDelay) ? configDelay(args) : configDelay;
    } else {
      resolvedDelay = isFunction(params.delay) ? params.delay(args) : params.delay;
    }
    const resolvedTarget = isFunction(params.to) ? params.to(args) : params.to;
    let targetActorRef;
    if (typeof resolvedTarget === 'string') {
      if (resolvedTarget === SpecialTargets.Parent) {
        targetActorRef = actorContext?.self._parent;
      } else if (resolvedTarget === SpecialTargets.Internal) {
        targetActorRef = actorContext?.self;
      } else if (resolvedTarget.startsWith('#_')) {
        // SCXML compatibility: https://www.w3.org/TR/scxml/#SCXMLEventProcessor
        // #_invokeid. If the target is the special term '#_invokeid', where invokeid is the invokeid of an SCXML session that the sending session has created by <invoke>, the Processor must add the event to the external queue of that session.
        targetActorRef = state.children[resolvedTarget.slice(2)];
      } else {
        targetActorRef = state.children[resolvedTarget];
      }
      if (!targetActorRef) {
        throw new Error(`Unable to send event to actor '${resolvedTarget}' from machine '${state.machine.id}'.`);
      }
    } else {
      targetActorRef = resolvedTarget || actorContext?.self;
    }
    const resolvedAction = {
      type: send$1,
      params: {
        ...params,
        to: targetActorRef,
        event: resolvedEvent,
        delay: resolvedDelay,
        internal: resolvedTarget === SpecialTargets.Internal
      },
      execute: actorCtx => {
        const sendAction = resolvedAction;
        if (typeof sendAction.params.delay === 'number') {
          actorCtx.self.delaySend(sendAction);
          return;
        } else {
          const target = sendAction.params.to;
          const sentEvent = sendAction.params.event;
          actorCtx.defer(() => {
            target.send(sentEvent.type === error$1 ? {
              type: `${error(actorCtx.self.id)}`,
              data: sentEvent.data
            } : sendAction.params.event);
          });
        }
      }
    };
    return [state, resolvedAction];
  });
}

/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */
function sendParent(event, options) {
  return send(event, {
    ...options,
    to: SpecialTargets.Parent
  });
}

/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */
function forwardTo(target, options) {
  return send(({
                 event
               }) => event, {
    ...options,
    to: target
  });
}

/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */
function escalate(errorData, options) {
  return sendParent(arg => {
    return {
      type: error$1,
      data: isFunction(errorData) ? errorData(arg) : errorData
    };
  }, {
    ...options,
    to: SpecialTargets.Parent
  });
}

/**
 * Sends an event to an actor.
 *
 * @param actor The `ActorRef` to send the event to.
 * @param event The event to send, or an expression that evaluates to the event to send
 * @param options Send action options
 * @returns An XState send action object
 */
function sendTo(actor, event, options) {
  return send(event, {
    ...options,
    to: actor
  });
}

const cache = new WeakMap();
function memo(object, key, fn) {
  let memoizedData = cache.get(object);
  if (!memoizedData) {
    memoizedData = {
      [key]: fn()
    };
    cache.set(object, memoizedData);
  } else if (!(key in memoizedData)) {
    memoizedData[key] = fn();
  }
  return memoizedData[key];
}

/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */

function cancel(sendId) {
  return createDynamicAction({
    type: cancel$1,
    params: {
      sendId
    }
  }, (event, {
    state,
    actorContext
  }) => {
    const resolvedSendId = isFunction(sendId) ? sendId({
      context: state.context,
      event,
      self: actorContext?.self ?? {},
      system: actorContext?.system
    }) : sendId;
    return [state, {
      type: 'xstate.cancel',
      params: {
        sendId: resolvedSendId
      },
      execute: actorCtx => {
        const interpreter = actorCtx.self;
        interpreter.cancel(resolvedSendId);
      }
    }];
  });
}

const symbolObservable = (() => typeof Symbol === 'function' && Symbol.observable || '@@observable')();

class Mailbox {
  constructor(_process) {
    this._process = _process;
    this._active = false;
    this._current = null;
    this._last = null;
  }
  start() {
    this._active = true;
    this.flush();
  }
  clear() {
    // we can't set _current to null because we might be currently processing
    // and enqueue following clear shouldnt start processing the enqueued item immediately
    if (this._current) {
      this._current.next = null;
      this._last = this._current;
    }
  }

  // TODO: rethink this design
  prepend(event) {
    if (!this._current) {
      this.enqueue(event);
      return;
    }

    // we know that something is already queued up
    // so the mailbox is already flushing or it's inactive
    // therefore the only thing that we need to do is to reassign `this._current`
    this._current = {
      value: event,
      next: this._current
    };
  }
  enqueue(event) {
    const enqueued = {
      value: event,
      next: null
    };
    if (this._current) {
      this._last.next = enqueued;
      this._last = enqueued;
      return;
    }
    this._current = enqueued;
    this._last = enqueued;
    if (this._active) {
      this.flush();
    }
  }
  flush() {
    while (this._current) {
      // atm the given _process is responsible for implementing proper try/catch handling
      // we assume here that this won't throw in a way that can affect this mailbox
      const consumed = this._current;
      this._process(consumed.value);
      // something could have been prepended in the meantime
      // so we need to be defensive here to avoid skipping over a prepended item
      if (consumed === this._current) {
        this._current = this._current.next;
      }
    }
    this._last = null;
  }
}

function createSystem() {
  let sessionIdCounter = 0;
  const children = new Map();
  const keyedActors = new Map();
  const reverseKeyedActors = new WeakMap();
  const system = {
    _bookId: () => `x:${sessionIdCounter++}`,
    _register: (sessionId, actorRef) => {
      children.set(sessionId, actorRef);
      return sessionId;
    },
    _unregister: actorRef => {
      children.delete(actorRef.sessionId);
      const systemId = reverseKeyedActors.get(actorRef);
      if (systemId !== undefined) {
        keyedActors.delete(systemId);
        reverseKeyedActors.delete(actorRef);
      }
    },
    get: systemId => {
      return keyedActors.get(systemId);
    },
    _set: (systemId, actorRef) => {
      const existing = keyedActors.get(systemId);
      if (existing && existing !== actorRef) {
        throw new Error(`Actor with system ID '${systemId}' already exists.`);
      }
      keyedActors.set(systemId, actorRef);
      reverseKeyedActors.set(actorRef, systemId);
    }
  };
  return system;
}

let ActorStatus = /*#__PURE__*/function (ActorStatus) {
  ActorStatus[ActorStatus["NotStarted"] = 0] = "NotStarted";
  ActorStatus[ActorStatus["Running"] = 1] = "Running";
  ActorStatus[ActorStatus["Stopped"] = 2] = "Stopped";
  return ActorStatus;
}({});
const defaultOptions = {
  deferEvents: true,
  clock: {
    setTimeout: (fn, ms) => {
      return setTimeout(fn, ms);
    },
    clearTimeout: id => {
      return clearTimeout(id);
    }
  },
  logger: console.log.bind(console),
  devTools: false
};
class Interpreter {
  /**
   * The current state of the interpreted logic.
   */

  /**
   * The clock that is responsible for setting and clearing timeouts, such as delayed events and transitions.
   */

  /**
   * The unique identifier for this actor relative to its parent.
   */

  /**
   * Whether the service is started.
   */

  // Actor Ref

  // TODO: add typings for system

  /**
   * The globally unique process ID for this invocation.
   */

  /**
   * Creates a new Interpreter instance (i.e., service) for the given logic with the provided options, if any.
   *
   * @param logic The logic to be interpreted
   * @param options Interpreter options
   */
  constructor(logic, options) {
    this.logic = logic;
    this._state = void 0;
    this.clock = void 0;
    this.options = void 0;
    this.id = void 0;
    this.mailbox = new Mailbox(this._process.bind(this));
    this.delayedEventsMap = {};
    this.observers = new Set();
    this.logger = void 0;
    this.status = ActorStatus.NotStarted;
    this._parent = void 0;
    this.ref = void 0;
    this._actorContext = void 0;
    this._systemId = void 0;
    this.sessionId = void 0;
    this.system = void 0;
    this._doneEvent = void 0;
    this.src = void 0;
    this._deferred = [];
    const resolvedOptions = {
      ...defaultOptions,
      ...options
    };
    const {
      clock,
      logger,
      parent,
      id,
      systemId
    } = resolvedOptions;
    const self = this;
    this.system = parent?.system ?? createSystem();
    if (systemId) {
      this._systemId = systemId;
      this.system._set(systemId, this);
    }
    this.sessionId = this.system._bookId();
    this.id = id ?? this.sessionId;
    this.logger = logger;
    this.clock = clock;
    this._parent = parent;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src;
    this.ref = this;
    this._actorContext = {
      self,
      id: this.id,
      sessionId: this.sessionId,
      logger: this.logger,
      defer: fn => {
        this._deferred.push(fn);
      },
      system: this.system,
      stopChild: child => {
        if (child._parent !== this) {
          throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
        }
        child._stop();
      }
    };

    // Ensure that the send method is bound to this interpreter instance
    // if destructured
    this.send = this.send.bind(this);
    this._initState();
  }
  _initState() {
    this._state = this.options.state ? this.logic.restoreState ? this.logic.restoreState(this.options.state, this._actorContext) : this.options.state : this.logic.getInitialState(this._actorContext, this.options?.input);
  }

  // array of functions to defer

  update(state) {
    // Update state
    this._state = state;
    const snapshot = this.getSnapshot();

    // Execute deferred effects
    let deferredFn;
    while (deferredFn = this._deferred.shift()) {
      deferredFn();
    }
    for (const observer of this.observers) {
      observer.next?.(snapshot);
    }
    const status = this.logic.getStatus?.(state);
    switch (status?.status) {
      case 'done':
        this._stopProcedure();
        this._doneEvent = doneInvoke(this.id, status.data);
        this._parent?.send(this._doneEvent);
        this._complete();
        break;
      case 'error':
        this._stopProcedure();
        this._parent?.send(error(this.id, status.data));
        this._error(status.data);
        break;
    }
  }
  subscribe(nextListenerOrObserver, errorListener, completeListener) {
    const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
    this.observers.add(observer);
    if (this.status === ActorStatus.Stopped) {
      observer.complete?.();
      this.observers.delete(observer);
    }
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }

  /**
   * Starts the interpreter from the initial state
   */
  start() {
    if (this.status === ActorStatus.Running) {
      // Do not restart the service if it is already started
      return this;
    }
    this.system._register(this.sessionId, this);
    if (this._systemId) {
      this.system._set(this._systemId, this);
    }
    this.status = ActorStatus.Running;
    if (this.logic.start) {
      this.logic.start(this._state, this._actorContext);
    }

    // TODO: this notifies all subscribers but usually this is redundant
    // there is no real change happening here
    // we need to rethink if this needs to be refactored
    this.update(this._state);
    if (this.options.devTools) {
      this.attachDevTools();
    }
    this.mailbox.start();
    return this;
  }
  _process(event) {
    try {
      const nextState = this.logic.transition(this._state, event, this._actorContext);
      this.update(nextState);
      if (event.type === stopSignalType) {
        this._stopProcedure();
        this._complete();
      }
    } catch (err) {
      // TODO: properly handle errors
      if (this.observers.size > 0) {
        this.observers.forEach(observer => {
          observer.error?.(err);
        });
        this.stop();
      } else {
        throw err;
      }
    }
  }
  _stop() {
    if (this.status === ActorStatus.Stopped) {
      return this;
    }
    this.mailbox.clear();
    if (this.status === ActorStatus.NotStarted) {
      this.status = ActorStatus.Stopped;
      return this;
    }
    this.mailbox.enqueue({
      type: stopSignalType
    });
    return this;
  }

  /**
   * Stops the interpreter and unsubscribe all listeners.
   */
  stop() {
    if (this._parent) {
      throw new Error('A non-root actor cannot be stopped directly.');
    }
    return this._stop();
  }
  _complete() {
    for (const observer of this.observers) {
      observer.complete?.();
    }
    this.observers.clear();
  }
  _error(data) {
    for (const observer of this.observers) {
      observer.error?.(data);
    }
    this.observers.clear();
  }
  _stopProcedure() {
    if (this.status !== ActorStatus.Running) {
      // Interpreter already stopped; do nothing
      return this;
    }

    // Cancel all delayed events
    for (const key of Object.keys(this.delayedEventsMap)) {
      this.clock.clearTimeout(this.delayedEventsMap[key]);
    }

    // TODO: mailbox.reset
    this.mailbox.clear();
    // TODO: after `stop` we must prepare ourselves for receiving events again
    // events sent *after* stop signal must be queued
    // it seems like this should be the common behavior for all of our consumers
    // so perhaps this should be unified somehow for all of them
    this.mailbox = new Mailbox(this._process.bind(this));
    this.status = ActorStatus.Stopped;
    this.system._unregister(this);
    return this;
  }

  /**
   * Sends an event to the running interpreter to trigger a transition.
   *
   * @param event The event to send
   */
  send(event) {
    if (typeof event === 'string') {
      throw new Error(`Only event objects may be sent to actors; use .send({ type: "${event}" }) instead`);
    }
    if (this.status === ActorStatus.Stopped) {
      return;
    }
    if (this.status !== ActorStatus.Running && !this.options.deferEvents) {
      throw new Error(`Event "${event.type}" was sent to uninitialized actor "${this.id
        // tslint:disable-next-line:max-line-length
      }". Make sure .start() is called for this actor, or set { deferEvents: true } in the actor options.\nEvent: ${JSON.stringify(event)}`);
    }
    this.mailbox.enqueue(event);
  }

  // TODO: make private (and figure out a way to do this within the machine)
  delaySend(sendAction) {
    this.delayedEventsMap[sendAction.params.id] = this.clock.setTimeout(() => {
      if ('to' in sendAction.params && sendAction.params.to) {
        sendAction.params.to.send(sendAction.params.event);
      } else {
        this.send(sendAction.params.event);
      }
    }, sendAction.params.delay);
  }

  // TODO: make private (and figure out a way to do this within the machine)
  cancel(sendId) {
    this.clock.clearTimeout(this.delayedEventsMap[sendId]);
    delete this.delayedEventsMap[sendId];
  }
  attachDevTools() {
    const {
      devTools
    } = this.options;
    if (devTools) {
      const resolvedDevToolsAdapter = typeof devTools === 'function' ? devTools : dev_dist_xstateDev.devToolsAdapter;
      resolvedDevToolsAdapter(this);
    }
  }
  toJSON() {
    return {
      id: this.id
    };
  }
  getPersistedState() {
    return this.logic.getPersistedState?.(this._state);
  }
  [symbolObservable]() {
    return this;
  }
  getSnapshot() {
    return this.logic.getSnapshot ? this.logic.getSnapshot(this._state) : this._state;
  }
}

/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */

function interpret(logic, options) {
  const interpreter = new Interpreter(logic, options);
  return interpreter;
}

/**
 * Returns actor logic from a transition function and its initial state.
 *
 * A transition function is a function that takes the current state and an event and returns the next state.
 *
 * @param transition The transition function that returns the next state given the current state and event.
 * @param initialState The initial state of the transition function.
 * @returns Actor logic
 */
function fromTransition(transition, initialState) {
  const logic = {
    config: transition,
    transition: (state, event, actorContext) => {
      return transition(state, event, actorContext);
    },
    getInitialState: (_, input) => {
      return typeof initialState === 'function' ? initialState({
        input
      }) : initialState;
    },
    getSnapshot: state => state,
    getPersistedState: state => state,
    restoreState: state => state
  };
  return logic;
}

function fromPromise(
// TODO: add types
promiseCreator) {
  const resolveEventType = '$$xstate.resolve';
  const rejectEventType = '$$xstate.reject';

  // TODO: add event types
  const logic = {
    config: promiseCreator,
    transition: (state, event) => {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case resolveEventType:
          return {
            ...state,
            status: 'done',
            data: event.data,
            input: undefined
          };
        case rejectEventType:
          return {
            ...state,
            status: 'error',
            data: event.data,
            input: undefined
          };
        case stopSignalType:
          return {
            ...state,
            status: 'canceled',
            input: undefined
          };
        default:
          return state;
      }
    },
    start: (state, {
      self,
      system
    }) => {
      // TODO: determine how to allow customizing this so that promises
      // can be restarted if necessary
      if (state.status !== 'active') {
        return;
      }
      const resolvedPromise = Promise.resolve(promiseCreator({
        input: state.input,
        system
      }));
      resolvedPromise.then(response => {
        // TODO: remove this condition once dead letter queue lands
        if (self._state.status !== 'active') {
          return;
        }
        self.send({
          type: resolveEventType,
          data: response
        });
      }, errorData => {
        // TODO: remove this condition once dead letter queue lands
        if (self._state.status !== 'active') {
          return;
        }
        self.send({
          type: rejectEventType,
          data: errorData
        });
      });
    },
    getInitialState: (_, input) => {
      return {
        status: 'active',
        data: undefined,
        input
      };
    },
    getSnapshot: state => state.data,
    getStatus: state => state,
    getPersistedState: state => state,
    restoreState: state => state
  };
  return logic;
}

// TODO: this likely shouldn't accept TEvent, observable actor doesn't accept external events
function fromObservable(observableCreator) {
  const nextEventType = '$$xstate.next';
  const errorEventType = '$$xstate.error';
  const completeEventType = '$$xstate.complete';

  // TODO: add event types
  const logic = {
    config: observableCreator,
    transition: (state, event, {
      self,
      id,
      defer
    }) => {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case nextEventType:
          // match the exact timing of events sent by machines
          // send actions are not executed immediately
          defer(() => {
            self._parent?.send({
              type: `xstate.snapshot.${id}`,
              data: event.data
            });
          });
          return {
            ...state,
            data: event.data
          };
        case errorEventType:
          return {
            ...state,
            status: 'error',
            input: undefined,
            data: event.data,
            subscription: undefined
          };
        case completeEventType:
          return {
            ...state,
            status: 'done',
            input: undefined,
            subscription: undefined
          };
        case stopSignalType:
          state.subscription.unsubscribe();
          return {
            ...state,
            status: 'canceled',
            input: undefined,
            subscription: undefined
          };
        default:
          return state;
      }
    },
    getInitialState: (_, input) => {
      return {
        subscription: undefined,
        status: 'active',
        data: undefined,
        input
      };
    },
    start: (state, {
      self,
      system
    }) => {
      if (state.status === 'done') {
        // Do not restart a completed observable
        return;
      }
      state.subscription = observableCreator({
        input: state.input,
        system
      }).subscribe({
        next: value => {
          self.send({
            type: nextEventType,
            data: value
          });
        },
        error: err => {
          self.send({
            type: errorEventType,
            data: err
          });
        },
        complete: () => {
          self.send({
            type: completeEventType
          });
        }
      });
    },
    getSnapshot: state => state.data,
    getPersistedState: ({
                          status,
                          data,
                          input
                        }) => ({
      status,
      data,
      input
    }),
    getStatus: state => state,
    restoreState: state => ({
      ...state,
      subscription: undefined
    })
  };
  return logic;
}

/**
 * Creates event observable logic that listens to an observable
 * that delivers event objects.
 *
 *
 * @param lazyObservable A function that creates an observable
 * @returns Event observable logic
 */

function fromEventObservable(lazyObservable) {
  const errorEventType = '$$xstate.error';
  const completeEventType = '$$xstate.complete';

  // TODO: event types
  const logic = {
    config: lazyObservable,
    transition: (state, event) => {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case errorEventType:
          return {
            ...state,
            status: 'error',
            input: undefined,
            data: event.data,
            subscription: undefined
          };
        case completeEventType:
          return {
            ...state,
            status: 'done',
            input: undefined,
            subscription: undefined
          };
        case stopSignalType:
          state.subscription.unsubscribe();
          return {
            ...state,
            status: 'canceled',
            input: undefined,
            subscription: undefined
          };
        default:
          return state;
      }
    },
    getInitialState: (_, input) => {
      return {
        subscription: undefined,
        status: 'active',
        data: undefined,
        input
      };
    },
    start: (state, {
      self,
      system
    }) => {
      if (state.status === 'done') {
        // Do not restart a completed observable
        return;
      }
      state.subscription = lazyObservable({
        input: state.input,
        system
      }).subscribe({
        next: value => {
          self._parent?.send(value);
        },
        error: err => {
          self.send({
            type: errorEventType,
            data: err
          });
        },
        complete: () => {
          self.send({
            type: completeEventType
          });
        }
      });
    },
    getSnapshot: _ => undefined,
    getPersistedState: ({
                          status,
                          data,
                          input
                        }) => ({
      status,
      data,
      input
    }),
    getStatus: state => state,
    restoreState: state => ({
      ...state,
      subscription: undefined
    })
  };
  return logic;
}

function fromCallback(invokeCallback) {
  const logic = {
    config: invokeCallback,
    start: (_state, {
      self
    }) => {
      self.send({
        type: startSignalType
      });
    },
    transition: (state, event, {
      self,
      id,
      system
    }) => {
      if (event.type === startSignalType) {
        const sender = eventForParent => {
          if (state.canceled) {
            return;
          }
          self._parent?.send(eventForParent);
        };
        const receiver = newListener => {
          state.receivers.add(newListener);
        };
        state.dispose = invokeCallback(sender, receiver, {
          input: state.input,
          system
        });
        if (isPromiseLike(state.dispose)) {
          state.dispose.then(resolved => {
            self._parent?.send(doneInvoke(id, resolved));
            state.canceled = true;
          }, errorData => {
            state.canceled = true;
            self._parent?.send(error(id, errorData));
          });
        }
        return state;
      }
      if (event.type === stopSignalType) {
        state.canceled = true;
        if (isFunction(state.dispose)) {
          state.dispose();
        }
        return state;
      }
      if (isSignal(event.type)) {
        // TODO: unrecognized signal
        return state;
      }
      if (!isSignal(event.type)) {
        state.receivers.forEach(receiver => receiver(event));
      }
      return state;
    },
    getInitialState: (_, input) => {
      return {
        canceled: false,
        receivers: new Set(),
        dispose: undefined,
        input
      };
    },
    getSnapshot: () => undefined,
    getPersistedState: ({
                          input
                        }) => input
  };
  return logic;
}

const startSignalType = 'xstate.init';
const stopSignalType = 'xstate.stop';
const startSignal = {
  type: 'xstate.init'
};
const stopSignal = {
  type: 'xstate.stop'
};
/**
 * An object that expresses the actor logic in reaction to received events,
 * as well as an optionally emitted stream of values.
 *
 * @template TReceived The received event
 * @template TSnapshot The emitted value
 */

function isSignal(eventType) {
  return eventType === startSignalType || eventType === stopSignalType;
}
function isActorRef(item) {
  return !!item && typeof item === 'object' && typeof item.send === 'function';
}

// TODO: refactor the return type, this could be written in a better way
// but it's best to avoid unneccessary breaking changes now
// @deprecated use `interpret(actorLogic)` instead
function toActorRef(actorRefLike) {
  return {
    subscribe: () => ({
      unsubscribe: () => void 0
    }),
    id: 'anonymous',
    sessionId: '',
    getSnapshot: () => undefined,
    [symbolObservable]: function () {
      return this;
    },
    status: ActorStatus.Running,
    stop: () => void 0,
    ...actorRefLike
  };
}
const emptyLogic = fromTransition(_ => undefined, undefined);
function createEmptyActor() {
  return interpret(emptyLogic);
}

function invoke(invokeDef) {
  return createDynamicAction({
    type: invoke$1,
    params: invokeDef
  }, (event, {
    state,
    actorContext
  }) => {
    const type = invoke$1;
    const {
      id,
      src
    } = invokeDef;
    let resolvedInvokeAction;
    if (isActorRef(src)) {
      resolvedInvokeAction = {
        type,
        params: {
          ...invokeDef,
          ref: src
        }
      };
    } else {
      const referenced = resolveReferencedActor(state.machine.options.actors[src]);
      if (!referenced) {
        resolvedInvokeAction = {
          type,
          params: invokeDef
        };
      } else {
        const input = 'input' in invokeDef ? invokeDef.input : referenced.input;
        const ref = interpret(referenced.src, {
          id,
          src,
          parent: actorContext?.self,
          systemId: invokeDef.systemId,
          input: typeof input === 'function' ? input({
            context: state.context,
            event,
            self: actorContext?.self
          }) : input
        });
        resolvedInvokeAction = {
          type,
          params: {
            ...invokeDef,
            ref
          }
        };
      }
    }
    const actorRef = resolvedInvokeAction.params.ref;
    const invokedState = cloneState(state, {
      children: {
        ...state.children,
        [id]: actorRef
      }
    });
    resolvedInvokeAction.execute = actorCtx => {
      const parent = actorCtx.self;
      const {
        id,
        ref
      } = resolvedInvokeAction.params;
      if (!ref) {
        return;
      }
      actorCtx.defer(() => {
        if (actorRef.status === ActorStatus.Stopped) {
          return;
        }
        try {
          actorRef.start?.();
        } catch (err) {
          parent.send(error(id, err));
          return;
        }
      });
    };
    return [invokedState, resolvedInvokeAction];
  });
}

function stateIn(stateValue) {
  return {
    type: 'xstate.guard:in',
    params: {
      stateValue
    },
    predicate: ({
                  state
                }) => {
      if (isString(stateValue) && isStateId(stateValue)) {
        return state.configuration.some(sn => sn.id === stateValue.slice(1));
      }
      return state.matches(stateValue);
    }
  };
}
function not(guard) {
  return {
    type: 'xstate.boolean',
    params: {
      op: 'not'
    },
    children: [toGuardDefinition(guard)],
    predicate: ({
                  evaluate,
                  guard,
                  context,
                  event,
                  state
                }) => {
      return !evaluate(guard.children[0], context, event, state);
    }
  };
}
function and(guards) {
  return {
    type: 'xstate.boolean',
    params: {
      op: 'and'
    },
    children: guards.map(guard => toGuardDefinition(guard)),
    predicate: ({
                  evaluate,
                  guard,
                  context,
                  event,
                  state
                }) => {
      return guard.children.every(childGuard => {
        return evaluate(childGuard, context, event, state);
      });
    }
  };
}
function or(guards) {
  return {
    type: 'xstate.boolean',
    params: {
      op: 'or'
    },
    children: guards.map(guard => toGuardDefinition(guard)),
    predicate: ({
                  evaluate,
                  guard,
                  context,
                  event,
                  state
                }) => {
      return guard.children.some(childGuard => {
        return evaluate(childGuard, context, event, state);
      });
    }
  };
}
function evaluateGuard(guard, context, event, state) {
  const {
    machine
  } = state;
  const predicate = machine?.options?.guards?.[guard.type] ?? guard.predicate;
  if (!predicate) {
    throw new Error(`Guard '${guard.type}' is not implemented.'.`);
  }
  return predicate({
    context,
    event,
    state,
    guard,
    evaluate: evaluateGuard
  });
}
function toGuardDefinition(guardConfig, getPredicate) {
  if (isString(guardConfig)) {
    return {
      type: guardConfig,
      predicate: getPredicate?.(guardConfig) || undefined,
      params: {
        type: guardConfig
      }
    };
  }
  if (isFunction(guardConfig)) {
    return {
      type: guardConfig.name,
      predicate: guardConfig,
      params: {
        type: guardConfig.name,
        name: guardConfig.name
      }
    };
  }
  return {
    type: guardConfig.type,
    params: guardConfig.params || guardConfig,
    children: guardConfig.children?.map(childGuard => toGuardDefinition(childGuard, getPredicate)),
    predicate: getPredicate?.(guardConfig.type) || guardConfig.predicate
  };
}

function getOutput(configuration, context, event) {
  const machine = configuration[0].machine;
  const finalChildStateNode = configuration.find(stateNode => stateNode.type === 'final' && stateNode.parent === machine.root);
  return finalChildStateNode && finalChildStateNode.output ? mapContext(finalChildStateNode.output, context, event) : undefined;
}
const isAtomicStateNode = stateNode => stateNode.type === 'atomic' || stateNode.type === 'final';
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter(sn => sn.type !== 'history');
}
function getProperAncestors(stateNode, toStateNode) {
  const ancestors = [];

  // add all ancestors
  let m = stateNode.parent;
  while (m && m !== toStateNode) {
    ancestors.push(m);
    m = m.parent;
  }
  return ancestors;
}
function getConfiguration(stateNodes) {
  const configuration = new Set(stateNodes);
  const configurationSet = new Set(stateNodes);
  const adjList = getAdjList(configurationSet);

  // add descendants
  for (const s of configuration) {
    // if previously active, add existing child nodes
    if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
      getInitialStateNodes(s).forEach(sn => configurationSet.add(sn));
    } else {
      if (s.type === 'parallel') {
        for (const child of getChildren(s)) {
          if (child.type === 'history') {
            continue;
          }
          if (!configurationSet.has(child)) {
            for (const initialStateNode of getInitialStateNodes(child)) {
              configurationSet.add(initialStateNode);
            }
          }
        }
      }
    }
  }

  // add all ancestors
  for (const s of configurationSet) {
    let m = s.parent;
    while (m) {
      configurationSet.add(m);
      m = m.parent;
    }
  }
  return configurationSet;
}
function getValueFromAdj(baseNode, adjList) {
  const childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    const childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isAtomicStateNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  const stateValue = {};
  for (const childStateNode of childStateNodes) {
    stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
  }
  return stateValue;
}
function getAdjList(configuration) {
  const adjList = new Map();
  for (const s of configuration) {
    if (!adjList.has(s)) {
      adjList.set(s, []);
    }
    if (s.parent) {
      if (!adjList.has(s.parent)) {
        adjList.set(s.parent, []);
      }
      adjList.get(s.parent).push(s);
    }
  }
  return adjList;
}
function getStateValue(rootNode, configuration) {
  const config = getConfiguration(configuration);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function isInFinalState(configuration, stateNode = configuration[0].machine.root) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(s => s.type === 'final' && configuration.includes(s));
  }
  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(sn => isInFinalState(configuration, sn));
  }
  return false;
}
const isStateId = str => str[0] === STATE_IDENTIFIER;
function getCandidates(stateNode, receivedEventType) {
  const candidates = stateNode.transitions.filter(transition => {
    const {
      eventType
    } = transition;
    // First, check the trivial case: event names are exactly equal
    if (eventType === receivedEventType) {
      return true;
    }

    // Then, check if transition is a wildcard transition,
    // which matches any non-transient events
    if (eventType === WILDCARD) {
      return true;
    }
    if (!eventType.endsWith('.*')) {
      return false;
    }
    const partialEventTokens = eventType.split('.');
    const eventTokens = receivedEventType.split('.');
    for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
      const partialEventToken = partialEventTokens[tokenIndex];
      const eventToken = eventTokens[tokenIndex];
      if (partialEventToken === '*') {
        const isLastToken = tokenIndex === partialEventTokens.length - 1;
        return isLastToken;
      }
      if (partialEventToken !== eventToken) {
        return false;
      }
    }
    return true;
  });
  return candidates;
}

/**
 * All delayed transitions from the config.
 */
function getDelayedTransitions(stateNode) {
  const afterConfig = stateNode.config.after;
  if (!afterConfig) {
    return [];
  }
  const mutateEntryExit = (delay, i) => {
    const delayRef = isFunction(delay) ? `${stateNode.id}:delay[${i}]` : delay;
    const eventType = after(delayRef, stateNode.id);
    stateNode.entry.push(raise({
      type: eventType
    }, {
      delay
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  const delayedTransitions = isArray(afterConfig) ? afterConfig.map((transition, i) => {
    const eventType = mutateEntryExit(transition.delay, i);
    return {
      ...transition,
      event: eventType
    };
  }) : Object.keys(afterConfig).flatMap((delay, i) => {
    const configTransition = afterConfig[delay];
    const resolvedTransition = isString(configTransition) ? {
      target: configTransition
    } : configTransition;
    const resolvedDelay = !isNaN(+delay) ? +delay : delay;
    const eventType = mutateEntryExit(resolvedDelay, i);
    return toArray(resolvedTransition).map(transition => ({
      ...transition,
      event: eventType,
      delay: resolvedDelay
    }));
  });
  return delayedTransitions.map(delayedTransition => {
    const {
      delay
    } = delayedTransition;
    return {
      ...formatTransition(stateNode, delayedTransition),
      delay
    };
  });
}
function formatTransition(stateNode, transitionConfig) {
  const normalizedTarget = normalizeTarget(transitionConfig.target);
  const reenter = transitionConfig.reenter ?? false;
  const {
    guards
  } = stateNode.machine.options;
  const target = resolveTarget(stateNode, normalizedTarget);
  const transition = {
    ...transitionConfig,
    actions: toActionObjects(toArray(transitionConfig.actions)),
    guard: transitionConfig.guard ? toGuardDefinition(transitionConfig.guard, guardType => guards[guardType]) : undefined,
    target,
    source: stateNode,
    reenter,
    eventType: transitionConfig.event,
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: target ? target.map(t => `#${t.id}`) : undefined
    })
  };
  return transition;
}
function formatTransitions(stateNode) {
  const transitionConfigs = [];
  if (Array.isArray(stateNode.config.on)) {
    transitionConfigs.push(...stateNode.config.on);
  } else if (stateNode.config.on) {
    const {
      [WILDCARD]: wildcardConfigs = [],
      ...namedTransitionConfigs
    } = stateNode.config.on;
    for (const eventType of Object.keys(namedTransitionConfigs)) {
      if (eventType === NULL_EVENT) {
        throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
      }
      const eventTransitionConfigs = toTransitionConfigArray(eventType, namedTransitionConfigs[eventType]);
      transitionConfigs.push(...eventTransitionConfigs);
      // TODO: add dev-mode validation for unreachable transitions
    }

    transitionConfigs.push(...toTransitionConfigArray(WILDCARD, wildcardConfigs));
  }
  const doneConfig = stateNode.config.onDone ? toTransitionConfigArray(String(done(stateNode.id)), stateNode.config.onDone) : [];
  const invokeConfig = stateNode.invoke.flatMap(invokeDef => {
    const settleTransitions = [];
    if (invokeDef.onDone) {
      settleTransitions.push(...toTransitionConfigArray(`done.invoke.${invokeDef.id}`, invokeDef.onDone));
    }
    if (invokeDef.onError) {
      settleTransitions.push(...toTransitionConfigArray(`error.platform.${invokeDef.id}`, invokeDef.onError));
    }
    if (invokeDef.onSnapshot) {
      settleTransitions.push(...toTransitionConfigArray(`xstate.snapshot.${invokeDef.id}`, invokeDef.onSnapshot));
    }
    return settleTransitions;
  });
  const delayedTransitions = stateNode.after;
  const formattedTransitions = [...doneConfig, ...invokeConfig, ...transitionConfigs].flatMap(transitionConfig => toArray(transitionConfig).map(transition => formatTransition(stateNode, transition)));
  for (const delayedTransition of delayedTransitions) {
    formattedTransitions.push(delayedTransition);
  }
  return formattedTransitions;
}
function formatInitialTransition(stateNode, _target) {
  if (isString(_target) || isArray(_target)) {
    const targets = toArray(_target).map(t => {
      // Resolve state string keys (which represent children)
      // to their state node
      const descStateNode = isString(t) ? isStateId(t) ? stateNode.machine.getStateNodeById(t) : stateNode.states[t] : t;
      if (!descStateNode) {
        throw new Error(`Initial state node "${t}" not found on parent state node #${stateNode.id}`);
      }
      if (!isDescendant(descStateNode, stateNode)) {
        throw new Error(`Invalid initial target: state node #${descStateNode.id} is not a descendant of #${stateNode.id}`);
      }
      return descStateNode;
    });
    const resolvedTarget = resolveTarget(stateNode, targets);
    const transition = {
      source: stateNode,
      actions: [],
      eventType: null,
      reenter: false,
      target: resolvedTarget,
      toJSON: () => ({
        ...transition,
        source: `#${stateNode.id}`,
        target: resolvedTarget ? resolvedTarget.map(t => `#${t.id}`) : undefined
      })
    };
    return transition;
  }
  return formatTransition(stateNode, {
    target: toArray(_target.target).map(t => {
      if (isString(t)) {
        return isStateId(t) ? t : `${stateNode.machine.delimiter}${t}`;
      }
      return t;
    }),
    actions: _target.actions,
    event: null
  });
}
function resolveTarget(stateNode, targets) {
  if (targets === undefined) {
    // an undefined target signals that the state node should not transition from that state when receiving that event
    return undefined;
  }
  return targets.map(target => {
    if (!isString(target)) {
      return target;
    }
    if (isStateId(target)) {
      return stateNode.machine.getStateNodeById(target);
    }
    const isInternalTarget = target[0] === stateNode.machine.delimiter;
    // If internal target is defined on machine,
    // do not include machine key on target
    if (isInternalTarget && !stateNode.parent) {
      return getStateNodeByPath(stateNode, target.slice(1));
    }
    const resolvedTarget = isInternalTarget ? stateNode.key + target : target;
    if (stateNode.parent) {
      try {
        const targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
        return targetStateNode;
      } catch (err) {
        throw new Error(`Invalid transition definition for state node '${stateNode.id}':\n${err.message}`);
      }
    } else {
      throw new Error(`Invalid target: "${target}" is not a valid target from the root node. Did you mean ".${target}"?`);
    }
  });
}
function resolveHistoryTarget(stateNode) {
  const normalizedTarget = normalizeTarget(stateNode.target);
  if (!normalizedTarget) {
    return stateNode.parent.initial.target;
  }
  return normalizedTarget.map(t => typeof t === 'string' ? getStateNodeByPath(stateNode.parent, t) : t);
}
function isHistoryNode(stateNode) {
  return stateNode.type === 'history';
}
function getInitialStateNodes(stateNode) {
  const set = new Set();
  function iter(descStateNode) {
    if (set.has(descStateNode)) {
      return;
    }
    set.add(descStateNode);
    if (descStateNode.type === 'compound') {
      for (const targetStateNode of descStateNode.initial.target) {
        for (const a of getProperAncestors(targetStateNode, stateNode)) {
          set.add(a);
        }
        iter(targetStateNode);
      }
    } else if (descStateNode.type === 'parallel') {
      for (const child of getChildren(descStateNode)) {
        iter(child);
      }
    }
  }
  iter(stateNode);
  return [...set];
}
/**
 * Returns the child state node from its relative `stateKey`, or throws.
 */
function getStateNode(stateNode, stateKey) {
  if (isStateId(stateKey)) {
    return stateNode.machine.getStateNodeById(stateKey);
  }
  if (!stateNode.states) {
    throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
  }
  const result = stateNode.states[stateKey];
  if (!result) {
    throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
  }
  return result;
}

/**
 * Returns the relative state node from the given `statePath`, or throws.
 *
 * @param statePath The string or string array relative path to the state node.
 */
function getStateNodeByPath(stateNode, statePath) {
  if (typeof statePath === 'string' && isStateId(statePath)) {
    try {
      return stateNode.machine.getStateNodeById(statePath);
    } catch (e) {
      // try individual paths
      // throw e;
    }
  }
  const arrayStatePath = toStatePath(statePath, stateNode.machine.delimiter).slice();
  let currentStateNode = stateNode;
  while (arrayStatePath.length) {
    const key = arrayStatePath.shift();
    if (!key.length) {
      break;
    }
    currentStateNode = getStateNode(currentStateNode, key);
  }
  return currentStateNode;
}

/**
 * Returns the state nodes represented by the current state value.
 *
 * @param state The state value or State instance
 */
function getStateNodes(stateNode, state) {
  const stateValue = state instanceof State ? state.value : toStateValue(state, stateNode.machine.delimiter);
  if (isString(stateValue)) {
    return [stateNode, stateNode.states[stateValue]];
  }
  const childStateKeys = Object.keys(stateValue);
  const childStateNodes = childStateKeys.map(subStateKey => getStateNode(stateNode, subStateKey)).filter(Boolean);
  return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
    const subStateNode = getStateNode(stateNode, subStateKey);
    if (!subStateNode) {
      return allSubStateNodes;
    }
    const subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
    return allSubStateNodes.concat(subStateNodes);
  }, []));
}
function transitionAtomicNode(stateNode, stateValue, state, event) {
  const childStateNode = getStateNode(stateNode, stateValue);
  const next = childStateNode.next(state, event);
  if (!next || !next.length) {
    return stateNode.next(state, event);
  }
  return next;
}
function transitionCompoundNode(stateNode, stateValue, state, event) {
  const subStateKeys = Object.keys(stateValue);
  const childStateNode = getStateNode(stateNode, subStateKeys[0]);
  const next = transitionNode(childStateNode, stateValue[subStateKeys[0]], state, event);
  if (!next || !next.length) {
    return stateNode.next(state, event);
  }
  return next;
}
function transitionParallelNode(stateNode, stateValue, state, event) {
  const allInnerTransitions = [];
  for (const subStateKey of Object.keys(stateValue)) {
    const subStateValue = stateValue[subStateKey];
    if (!subStateValue) {
      continue;
    }
    const subStateNode = getStateNode(stateNode, subStateKey);
    const innerTransitions = transitionNode(subStateNode, subStateValue, state, event);
    if (innerTransitions) {
      allInnerTransitions.push(...innerTransitions);
    }
  }
  if (!allInnerTransitions.length) {
    return stateNode.next(state, event);
  }
  return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, state, event) {
  // leaf node
  if (isString(stateValue)) {
    return transitionAtomicNode(stateNode, stateValue, state, event);
  }

  // compound node
  if (Object.keys(stateValue).length === 1) {
    return transitionCompoundNode(stateNode, stateValue, state, event);
  }

  // parallel node
  return transitionParallelNode(stateNode, stateValue, state, event);
}
function getHistoryNodes(stateNode) {
  return Object.keys(stateNode.states).map(key => stateNode.states[key]).filter(sn => sn.type === 'history');
}
function isDescendant(childStateNode, parentStateNode) {
  let marker = childStateNode;
  while (marker.parent && marker.parent !== parentStateNode) {
    marker = marker.parent;
  }
  return marker.parent === parentStateNode;
}
function getPathFromRootToNode(stateNode) {
  const path = [];
  let marker = stateNode.parent;
  while (marker) {
    path.unshift(marker);
    marker = marker.parent;
  }
  return path;
}
function hasIntersection(s1, s2) {
  const set1 = new Set(s1);
  const set2 = new Set(s2);
  for (const item of set1) {
    if (set2.has(item)) {
      return true;
    }
  }
  for (const item of set2) {
    if (set1.has(item)) {
      return true;
    }
  }
  return false;
}
function removeConflictingTransitions(enabledTransitions, configuration, historyValue) {
  const filteredTransitions = new Set();
  for (const t1 of enabledTransitions) {
    let t1Preempted = false;
    const transitionsToRemove = new Set();
    for (const t2 of filteredTransitions) {
      if (hasIntersection(computeExitSet([t1], configuration, historyValue), computeExitSet([t2], configuration, historyValue))) {
        if (isDescendant(t1.source, t2.source)) {
          transitionsToRemove.add(t2);
        } else {
          t1Preempted = true;
          break;
        }
      }
    }
    if (!t1Preempted) {
      for (const t3 of transitionsToRemove) {
        filteredTransitions.delete(t3);
      }
      filteredTransitions.add(t1);
    }
  }
  return Array.from(filteredTransitions);
}
function findLCCA(stateNodes) {
  const [head] = stateNodes;
  let current = getPathFromRootToNode(head);
  let candidates = [];
  for (const stateNode of stateNodes) {
    const path = getPathFromRootToNode(stateNode);
    candidates = current.filter(sn => path.includes(sn));
    current = candidates;
    candidates = [];
  }
  return current[current.length - 1];
}
function getEffectiveTargetStates(transition, historyValue) {
  if (!transition.target) {
    return [];
  }
  const targets = new Set();
  for (const targetNode of transition.target) {
    if (isHistoryNode(targetNode)) {
      if (historyValue[targetNode.id]) {
        for (const node of historyValue[targetNode.id]) {
          targets.add(node);
        }
      } else {
        for (const node of getEffectiveTargetStates({
          target: resolveHistoryTarget(targetNode)
        }, historyValue)) {
          targets.add(node);
        }
      }
    } else {
      targets.add(targetNode);
    }
  }
  return [...targets];
}
function getTransitionDomain(transition, historyValue) {
  const targetStates = getEffectiveTargetStates(transition, historyValue);
  if (!targetStates) {
    return null;
  }
  if (!transition.reenter && transition.source.type !== 'parallel' && targetStates.every(targetStateNode => isDescendant(targetStateNode, transition.source))) {
    return transition.source;
  }
  const lcca = findLCCA(targetStates.concat(transition.source));
  return lcca;
}
function computeExitSet(transitions, configuration, historyValue) {
  const statesToExit = new Set();
  for (const t of transitions) {
    if (t.target?.length) {
      const domain = getTransitionDomain(t, historyValue);
      for (const stateNode of configuration) {
        if (isDescendant(stateNode, domain)) {
          statesToExit.add(stateNode);
        }
      }
    }
  }
  return [...statesToExit];
}

/**
 * https://www.w3.org/TR/scxml/#microstepProcedure
 *
 * @private
 * @param transitions
 * @param currentState
 * @param mutConfiguration
 */

function microstep(transitions, currentState, actorCtx, event) {
  const {
    machine
  } = currentState;
  // Transition will "apply" if:
  // - the state node is the initial state (there is no current state)
  // - OR there are transitions
  const willTransition = currentState._initial || transitions.length > 0;
  const mutConfiguration = new Set(currentState.configuration);
  if (!currentState._initial && !willTransition) {
    const inertState = cloneState(currentState, {});
    inertState.changed = false;
    return inertState;
  }
  const [microstate, actions] = microstepProcedure(currentState._initial ? [{
    target: [...currentState.configuration].filter(isAtomicStateNode),
    source: machine.root,
    reenter: true,
    actions: [],
    eventType: null,
    toJSON: null // TODO: fix
  }] : transitions, currentState, mutConfiguration, event, actorCtx);
  const {
    context
  } = microstate;
  const nextState = cloneState(microstate, {
    value: {},
    // TODO: make optional
    transitions
  });
  nextState.changed = currentState._initial ? undefined : !stateValuesEqual(nextState.value, currentState.value) || actions.length > 0 || context !== currentState.context;
  return nextState;
}
function microstepProcedure(transitions, currentState, mutConfiguration, event, actorCtx) {
  const actions = [];
  const historyValue = {
    ...currentState.historyValue
  };
  const filteredTransitions = removeConflictingTransitions(transitions, mutConfiguration, historyValue);
  const internalQueue = [...currentState._internalQueue];

  // Exit states
  if (!currentState._initial) {
    exitStates(filteredTransitions, mutConfiguration, historyValue, actions);
  }

  // Execute transition content
  actions.push(...filteredTransitions.flatMap(t => t.actions));

  // Enter states
  enterStates(event, filteredTransitions, mutConfiguration, actions, internalQueue, currentState, historyValue);
  const nextConfiguration = [...mutConfiguration];
  const done = isInFinalState(nextConfiguration);
  if (done) {
    const finalActions = nextConfiguration.sort((a, b) => b.order - a.order).flatMap(state => state.exit);
    actions.push(...finalActions);
  }
  try {
    const [nextState, resolvedActions] = resolveActionsAndContext(actions, event, currentState, actorCtx);
    const output = done ? getOutput(nextConfiguration, nextState.context, event) : undefined;
    internalQueue.push(...nextState._internalQueue);
    return [cloneState(currentState, {
      configuration: nextConfiguration,
      historyValue,
      _internalQueue: internalQueue,
      context: nextState.context,
      done,
      output,
      children: nextState.children
    }), resolvedActions];
  } catch (e) {
    // TODO: Refactor this once proper error handling is implemented.
    // See https://github.com/statelyai/rfcs/pull/4
    throw e;
  }
}
function enterStates(event, filteredTransitions, mutConfiguration, actions, internalQueue, currentState, historyValue) {
  const statesToEnter = new Set();
  const statesForDefaultEntry = new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);

  // In the initial state, the root state node is "entered".
  if (currentState._initial) {
    statesForDefaultEntry.add(currentState.machine.root);
  }
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    mutConfiguration.add(stateNodeToEnter);
    for (const invokeDef of stateNodeToEnter.invoke) {
      actions.push(invoke(invokeDef));
    }

    // Add entry actions
    actions.push(...stateNodeToEnter.entry);
    if (statesForDefaultEntry.has(stateNodeToEnter)) {
      for (const stateNode of statesForDefaultEntry) {
        const initialActions = stateNode.initial.actions;
        actions.push(...initialActions);
      }
    }
    if (stateNodeToEnter.type === 'final') {
      const parent = stateNodeToEnter.parent;
      if (!parent.parent) {
        continue;
      }
      internalQueue.push(done(parent.id, stateNodeToEnter.output ? mapContext(stateNodeToEnter.output, currentState.context, event) : undefined));
      if (parent.parent) {
        const grandparent = parent.parent;
        if (grandparent.type === 'parallel') {
          if (getChildren(grandparent).every(parentNode => isInFinalState([...mutConfiguration], parentNode))) {
            internalQueue.push(done(grandparent.id));
          }
        }
      }
    }
  }
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  for (const t of transitions) {
    for (const s of t.target || []) {
      addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
    }
    const ancestor = getTransitionDomain(t, historyValue);
    const targetStates = getEffectiveTargetStates(t, historyValue);
    for (const s of targetStates) {
      addAncestorStatesToEnter(s, ancestor, statesToEnter, historyValue, statesForDefaultEntry);
    }
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      const historyStateNodes = historyValue[stateNode.id];
      for (const s of historyStateNodes) {
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyStateNodes) {
        addAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
        for (const stateForDefaultEntry of statesForDefaultEntry) {
          statesForDefaultEntry.add(stateForDefaultEntry);
        }
      }
    } else {
      const targets = resolveHistoryTarget(stateNode);
      for (const s of targets) {
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of targets) {
        addAncestorStatesToEnter(s, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
        for (const stateForDefaultEntry of statesForDefaultEntry) {
          statesForDefaultEntry.add(stateForDefaultEntry);
        }
      }
    }
  } else {
    statesToEnter.add(stateNode);
    if (stateNode.type === 'compound') {
      statesForDefaultEntry.add(stateNode);
      const initialStates = stateNode.initial.target;
      for (const initialState of initialStates) {
        addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const initialState of initialStates) {
        addAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
      }
    } else {
      if (stateNode.type === 'parallel') {
        for (const child of getChildren(stateNode).filter(sn => !isHistoryNode(sn))) {
          if (![...statesToEnter].some(s => isDescendant(s, child))) {
            addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
          }
        }
      }
    }
  }
}
function addAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  const properAncestors = getProperAncestors(stateNode, toStateNode);
  for (const anc of properAncestors) {
    statesToEnter.add(anc);
    if (anc.type === 'parallel') {
      for (const child of getChildren(anc).filter(sn => !isHistoryNode(sn))) {
        if (![...statesToEnter].some(s => isDescendant(s, child))) {
          addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
        }
      }
    }
  }
}
function exitStates(transitions, mutConfiguration, historyValue, actions) {
  const statesToExit = computeExitSet(transitions, mutConfiguration, historyValue);
  statesToExit.sort((a, b) => b.order - a.order);

  // From SCXML algorithm: https://www.w3.org/TR/scxml/#exitStates
  for (const exitStateNode of statesToExit) {
    for (const historyNode of getHistoryNodes(exitStateNode)) {
      let predicate;
      if (historyNode.history === 'deep') {
        predicate = sn => isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
      } else {
        predicate = sn => {
          return sn.parent === exitStateNode;
        };
      }
      historyValue[historyNode.id] = Array.from(mutConfiguration).filter(predicate);
    }
  }
  for (const s of statesToExit) {
    actions.push(...s.exit.flat(), ...s.invoke.map(def => stop(def.id)));
    mutConfiguration.delete(s);
  }
}
function resolveActionsAndContext(actions, event, currentState, actorCtx) {
  const {
    machine
  } = currentState;
  const resolvedActions = [];
  const raiseActions = [];
  let intermediateState = currentState;
  function handleAction(action) {
    resolvedActions.push(action);
    if (actorCtx?.self.status === ActorStatus.Running) {
      action.execute?.(actorCtx);
    } else {
      actorCtx?.defer(() => action.execute?.(actorCtx));
    }
  }
  function resolveAction(actionObject) {
    const executableActionObject = resolveActionObject(actionObject, machine.options.actions);
    if (isDynamicAction(executableActionObject)) {
      const [nextState, resolvedAction] = executableActionObject.resolve(event, {
        state: intermediateState,
        action: actionObject,
        actorContext: actorCtx
      });
      const matchedActions = resolvedAction.params?.actions;
      intermediateState = nextState;
      if ((resolvedAction.type === raise$1 || resolvedAction.type === send$1 && resolvedAction.params.internal) && typeof resolvedAction.params.delay !== 'number') {
        raiseActions.push(resolvedAction);
      }

      // TODO: remove the check; just handleAction
      if (resolvedAction.type !== pure$1) {
        handleAction(resolvedAction);
      }
      toActionObjects(matchedActions).forEach(resolveAction);
      return;
    }
    handleAction(executableActionObject);
  }
  for (const actionObject of actions) {
    resolveAction(actionObject);
  }
  return [cloneState(intermediateState, {
    _internalQueue: raiseActions.map(a => a.params.event)
  }), resolvedActions];
}
function macrostep(state, event, actorCtx) {
  let nextState = state;
  const states = [];

  // Handle stop event
  if (event.type === stopSignalType) {
    nextState = stopStep(event, nextState, actorCtx)[0];
    states.push(nextState);
    return {
      state: nextState,
      microstates: states
    };
  }
  let nextEvent = event;

  // Assume the state is at rest (no raised events)
  // Determine the next state based on the next microstep
  if (nextEvent.type !== init) {
    const transitions = selectTransitions(nextEvent, nextState);
    nextState = microstep(transitions, state, actorCtx, nextEvent);
    states.push(nextState);
  }
  while (!nextState.done) {
    let enabledTransitions = selectEventlessTransitions(nextState, nextEvent);
    if (!enabledTransitions.length) {
      if (!nextState._internalQueue.length) {
        break;
      } else {
        nextEvent = nextState._internalQueue[0];
        const transitions = selectTransitions(nextEvent, nextState);
        nextState = microstep(transitions, nextState, actorCtx, nextEvent);
        nextState._internalQueue.shift();
        states.push(nextState);
      }
    } else {
      nextState = microstep(enabledTransitions, nextState, actorCtx, nextEvent);
      states.push(nextState);
    }
  }
  if (nextState.done) {
    // Perform the stop step to ensure that child actors are stopped
    stopStep(nextEvent, nextState, actorCtx);
  }
  return {
    state: nextState,
    microstates: states
  };
}
function stopStep(event, nextState, actorCtx) {
  const actions = [];
  for (const stateNode of nextState.configuration.sort((a, b) => b.order - a.order)) {
    actions.push(...stateNode.exit);
  }
  for (const child of Object.values(nextState.children)) {
    actions.push(stop(child));
  }
  return resolveActionsAndContext(actions, event, nextState, actorCtx);
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
  const enabledTransitionSet = new Set();
  const atomicStates = nextState.configuration.filter(isAtomicStateNode);
  for (const stateNode of atomicStates) {
    loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, null))) {
      if (!s.always) {
        continue;
      }
      for (const transition of s.always) {
        if (transition.guard === undefined || evaluateGuard(transition.guard, nextState.context, event, nextState)) {
          enabledTransitionSet.add(transition);
          break loop;
        }
      }
    }
  }
  return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState.configuration), nextState.historyValue);
}

/**
 * Resolves a partial state value with its full representation in the state node's machine.
 *
 * @param stateValue The partial state value to resolve.
 */
function resolveStateValue(rootNode, stateValue) {
  const configuration = getConfiguration(getStateNodes(rootNode, stateValue));
  return getStateValue(rootNode, [...configuration]);
}
function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a === undefined || b === undefined) {
    return false;
  }
  if (isString(a) || isString(b)) {
    return a === b;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(key => stateValuesEqual(a[key], b[key]));
}
function getInitialConfiguration(rootNode) {
  const configuration = [];
  const initialTransition = rootNode.initial;
  const statesToEnter = new Set();
  const statesForDefaultEntry = new Set([rootNode]);
  computeEntrySet([initialTransition], {}, statesForDefaultEntry, statesToEnter);
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    configuration.push(stateNodeToEnter);
  }
  return configuration;
}

class State {
  /**
   * Indicates whether the state is a final state.
   */

  /**
   * The done data of the top-level finite state.
   */
  // TODO: add an explicit type for `output`

  /**
   * Indicates whether the state has changed from the previous state. A state is considered "changed" if:
   *
   * - Its value is not equal to its previous value, or:
   * - It has any new actions (side-effects) to execute.
   *
   * An initial state (with no history) will return `undefined`.
   */

  /**
   * The enabled state nodes representative of the state value.
   */

  /**
   * An object mapping actor names to spawned/invoked actors.
   */

  /**
   * Creates a new State instance for the given `stateValue` and `context`.
   * @param stateValue
   * @param context
   */
  static from(stateValue, context = {}, machine) {
    if (stateValue instanceof State) {
      if (stateValue.context !== context) {
        return new State({
          value: stateValue.value,
          context,
          meta: {},
          configuration: [],
          // TODO: fix,
          transitions: [],
          children: {}
        }, machine);
      }
      return stateValue;
    }
    const configuration = getConfiguration(getStateNodes(machine.root, stateValue));
    return new State({
      value: stateValue,
      context,
      meta: undefined,
      configuration: Array.from(configuration),
      children: {}
    }, machine);
  }

  /**
   * Creates a new `State` instance that represents the current state of a running machine.
   *
   * @param config
   */
  constructor(config, machine) {
    this.machine = machine;
    this.tags = void 0;
    this.value = void 0;
    this.done = void 0;
    this.output = void 0;
    this.context = void 0;
    this.historyValue = {};
    this._internalQueue = void 0;
    this._initial = false;
    this.changed = void 0;
    this.configuration = void 0;
    this.children = void 0;
    this.context = config.context;
    this._internalQueue = config._internalQueue ?? [];
    this.historyValue = config.historyValue || {};
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config.configuration ?? Array.from(getConfiguration(getStateNodes(machine.root, config.value)));
    this.children = config.children;
    this.value = getStateValue(machine.root, this.configuration);
    this.tags = new Set(flatten(this.configuration.map(sn => sn.tags)));
    this.done = config.done ?? false;
    this.output = config.output;
  }

  /**
   * Returns an array of all the string leaf state node paths.
   * @param stateValue
   * @param delimiter The character(s) that separate each subpath in the string state node path.
   */
  toStrings(stateValue = this.value, delimiter = '.') {
    if (isString(stateValue)) {
      return [stateValue];
    }
    const valueKeys = Object.keys(stateValue);
    return valueKeys.concat(...valueKeys.map(key => this.toStrings(stateValue[key], delimiter).map(s => key + delimiter + s)));
  }
  toJSON() {
    const {
      configuration,
      tags,
      machine,
      ...jsonValues
    } = this;
    return {
      ...jsonValues,
      tags: Array.from(tags),
      meta: this.meta
    };
  }

  /**
   * Whether the current state value is a subset of the given parent state value.
   * @param parentStateValue
   */
  matches(parentStateValue) {
    return matchesState(parentStateValue, this.value);
  }

  /**
   * Whether the current state configuration has a state node with the specified `tag`.
   * @param tag
   */
  hasTag(tag) {
    return this.tags.has(tag);
  }

  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   *
   * @param event The event to test
   * @returns Whether the event will cause a transition
   */
  can(event) {
    const transitionData = this.machine.getTransitionData(this, event);
    return !!transitionData?.length &&
      // Check that at least one transition is not forbidden
      transitionData.some(t => t.target !== undefined || t.actions.length);
  }

  /**
   * The next events that will cause a transition from the current state.
   */
  get nextEvents() {
    return memo(this, 'nextEvents', () => {
      return [...new Set(flatten([...this.configuration.map(sn => sn.ownEvents)]))];
    });
  }
  get meta() {
    return this.configuration.reduce((acc, stateNode) => {
      if (stateNode.meta !== undefined) {
        acc[stateNode.id] = stateNode.meta;
      }
      return acc;
    }, {});
  }
}
function cloneState(state, config = {}) {
  return new State({
    ...state,
    ...config
  }, state.machine);
}
function getPersistedState(state) {
  const {
    configuration,
    tags,
    machine,
    children,
    ...jsonValues
  } = state;
  const childrenJson = {};
  for (const id in children) {
    childrenJson[id] = {
      state: children[id].getPersistedState?.(),
      src: children[id].src
    };
  }
  return {
    ...jsonValues,
    children: childrenJson
  };
}

/**
 * Stops an actor.
 *
 * @param actorRef The actor to stop.
 */

function stop(actorRef) {
  const actor = actorRef;
  return createDynamicAction({
    type: stop$1,
    params: {
      actor
    }
  }, (event, {
    state
  }) => {
    const actorRefOrString = isFunction(actor) ? actor({
      context: state.context,
      event
    }) : actor;
    const actorRef = typeof actorRefOrString === 'string' ? state.children[actorRefOrString] : actorRefOrString;
    let children = state.children;
    if (actorRef) {
      children = {
        ...children
      };
      delete children[actorRef.id];
    }
    return [cloneState(state, {
      children
    }), {
      type: 'xstate.stop',
      params: {
        actor: actorRef
      },
      execute: actorCtx => {
        if (!actorRef) {
          return;
        }
        if (actorRef.status !== ActorStatus.Running) {
          actorCtx.stopChild(actorRef);
          return;
        }
        actorCtx.defer(() => {
          actorCtx.stopChild(actorRef);
        });
      }
    }];
  });
}

const defaultLogExpr = ({
                          context,
                          event
                        }) => ({
  context,
  event
});

/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */

function log(expr = defaultLogExpr, label) {
  return createDynamicAction({
    type: log$1,
    params: {
      label,
      expr
    }
  }, (event, {
    state,
    actorContext
  }) => {
    const resolvedValue = typeof expr === 'function' ? expr({
      context: state.context,
      event,
      self: actorContext?.self ?? {},
      system: actorContext?.system
    }) : expr;
    return [state, {
      type: 'xstate.log',
      params: {
        label,
        value: resolvedValue
      },
      execute: actorCtx => {
        if (label) {
          actorCtx.logger?.(label, resolvedValue);
        } else {
          actorCtx.logger?.(resolvedValue);
        }
      }
    }];
  });
}

function createSpawner(self, machine, context, event, mutCapturedActions) {
  return (src, options = {}) => {
    const {
      systemId
    } = options;
    if (isString(src)) {
      const referenced = resolveReferencedActor(machine.options.actors[src]);
      if (referenced) {
        const resolvedName = options.id ?? 'anon'; // TODO: better name
        const input = 'input' in options ? options.input : referenced.input;

        // TODO: this should also receive `src`
        const actorRef = interpret(referenced.src, {
          id: resolvedName,
          parent: self,
          input: typeof input === 'function' ? input({
            context,
            event,
            self
          }) : input
        });
        mutCapturedActions.push(invoke({
          id: actorRef.id,
          // @ts-ignore TODO: fix types
          src: actorRef,
          // TODO
          ref: actorRef,
          meta: undefined,
          input,
          systemId
        }));
        return actorRef; // TODO: fix types
      }

      throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
    } else {
      // TODO: this should also receive `src`
      // TODO: instead of anonymous, it should be a unique stable ID
      const actorRef = interpret(src, {
        id: options.id || 'anonymous',
        parent: self,
        input: options.input,
        systemId
      });
      mutCapturedActions.push(invoke({
        // @ts-ignore TODO: fix types
        src: actorRef,
        ref: actorRef,
        id: actorRef.id,
        meta: undefined,
        input: options.input
      }));
      return actorRef; // TODO: fix types
    }
  };
}

/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */
function assign(assignment) {
  return createDynamicAction({
    type: assign$1,
    params: {
      assignment
    }
  }, (event, {
    state,
    action,
    actorContext
  }) => {
    const capturedActions = [];
    if (!state.context) {
      throw new Error('Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.');
    }
    const args = {
      context: state.context,
      event,
      action,
      spawn: createSpawner(actorContext?.self, state.machine, state.context, event, capturedActions),
      self: actorContext?.self ?? {},
      system: actorContext?.system
    };
    let partialUpdate = {};
    if (isFunction(assignment)) {
      partialUpdate = assignment(args);
    } else {
      for (const key of Object.keys(assignment)) {
        const propAssignment = assignment[key];
        partialUpdate[key] = isFunction(propAssignment) ? propAssignment(args) : propAssignment;
      }
    }
    const updatedContext = Object.assign({}, state.context, partialUpdate);
    return [cloneState(state, {
      context: updatedContext
    }), {
      type: assign$1,
      params: {
        context: updatedContext,
        actions: capturedActions
      }
    }];
  });
}

/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */

function raise(eventOrExpr, options) {
  return createDynamicAction({
    type: raise$1,
    params: {
      delay: options ? options.delay : undefined,
      event: eventOrExpr,
      id: options && options.id !== undefined ? options.id : typeof eventOrExpr === 'function' ? eventOrExpr.name : eventOrExpr.type
    }
  }, (event, {
    state,
    actorContext
  }) => {
    const params = {
      delay: options ? options.delay : undefined,
      event: eventOrExpr,
      id: options && options.id !== undefined ? options.id : typeof eventOrExpr === 'function' ? eventOrExpr.name : eventOrExpr.type
    };
    const args = {
      context: state.context,
      event,
      self: actorContext?.self ?? {},
      system: actorContext?.system
    };
    const delaysMap = state.machine.options.delays;

    // TODO: helper function for resolving Expr
    if (typeof eventOrExpr === 'string') {
      throw new Error(`Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`);
    }
    const resolvedEvent = typeof eventOrExpr === 'function' ? eventOrExpr(args) : eventOrExpr;
    let resolvedDelay;
    if (typeof params.delay === 'string') {
      const configDelay = delaysMap && delaysMap[params.delay];
      resolvedDelay = typeof configDelay === 'function' ? configDelay(args) : configDelay;
    } else {
      resolvedDelay = typeof params.delay === 'function' ? params.delay(args) : params.delay;
    }
    const resolvedAction = {
      type: raise$1,
      params: {
        ...params,
        event: resolvedEvent,
        delay: resolvedDelay
      },
      execute: actorCtx => {
        if (typeof resolvedAction.params.delay === 'number') {
          actorCtx.self.delaySend(resolvedAction);
          return;
        }
      }
    };
    return [state, resolvedAction];
  });
}

function choose(guards) {
  return createDynamicAction({
    type: choose$1,
    params: {
      guards
    }
  }, (event, {
    state
  }) => {
    const matchedActions = guards.find(condition => {
      const guard = condition.guard && toGuardDefinition(condition.guard, guardType => state.machine.options.guards[guardType]);
      return !guard || evaluateGuard(guard, state.context, event, state);
    })?.actions;
    return [state, {
      type: choose$1,
      params: {
        actions: toActionObjects(matchedActions)
      }
    }];
  });
}

function pure(getActions) {
  return createDynamicAction({
    type: pure$1,
    params: {
      get: getActions
    }
  }, (event, {
    state
  }) => {
    return [state, {
      type: pure$1,
      params: {
        actions: toArray(toActionObjects(getActions({
          context: state.context,
          event
        }))) ?? []
      }
    }];
  });
}

const initEvent = {
  type: init
};
function resolveActionObject(actionObject, actionFunctionMap) {
  if (isDynamicAction(actionObject)) {
    return actionObject;
  }
  const dereferencedAction = actionFunctionMap[actionObject.type];
  if (typeof dereferencedAction === 'function') {
    return createDynamicAction({
      type: 'xstate.function',
      params: actionObject.params ?? {}
    }, (event, {
      state
    }) => {
      const a = {
        type: actionObject.type,
        params: actionObject.params,
        execute: actorCtx => {
          return dereferencedAction({
            context: state.context,
            event,
            action: a,
            system: actorCtx.system,
            self: actorCtx.self
          });
        }
      };
      return [state, a];
    });
  } else if (dereferencedAction) {
    return dereferencedAction;
  } else {
    return actionObject;
  }
}
function toActionObject(action) {
  if (isDynamicAction(action)) {
    return action;
  }
  if (typeof action === 'string') {
    return {
      type: action,
      params: {}
    };
  }
  if (typeof action === 'function') {
    const type = 'xstate.function';
    return createDynamicAction({
      type,
      params: {}
    }, (event, {
      state
    }) => {
      const actionObject = {
        type,
        params: {
          function: action
        },
        execute: actorCtx => {
          return action({
            context: state.context,
            event: event,
            action: actionObject,
            self: actorCtx.self,
            system: actorCtx.system
          });
        }
      };
      return [state, actionObject];
    });
  }

  // action is already a BaseActionObject
  return action;
}
const toActionObjects = action => {
  if (!action) {
    return [];
  }
  const actions = isArray(action) ? action : [action];
  return actions.map(toActionObject);
};

/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */
function after(delayRef, id) {
  const idSuffix = id ? `#${id}` : '';
  return `${ActionTypes.After}(${delayRef})${idSuffix}`;
}

/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param output The data to pass into the event
 */
function done(id, output) {
  const type = `${ActionTypes.DoneState}.${id}`;
  const eventObject = {
    type,
    output
  };
  eventObject.toString = () => type;
  return eventObject;
}

/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param invokeId The invoked service ID
 * @param output The data to pass into the event
 */
function doneInvoke(invokeId, output) {
  const type = `${ActionTypes.DoneInvoke}.${invokeId}`;
  const eventObject = {
    type,
    output
  };
  eventObject.toString = () => type;
  return eventObject;
}
function error(id, data) {
  const type = `${ActionTypes.ErrorPlatform}.${id}`;
  const eventObject = {
    type,
    data
  };
  eventObject.toString = () => type;
  return eventObject;
}
function createInitEvent(input) {
  return {
    type: init,
    input
  };
}

exports.ActionTypes = ActionTypes;
exports.ActorStatus = ActorStatus;
exports.Interpreter = Interpreter;
exports.NULL_EVENT = NULL_EVENT;
exports.STATE_DELIMITER = STATE_DELIMITER;
exports.SpecialTargets = SpecialTargets;
exports.State = State;
exports.actionTypes = actionTypes;
exports.after = after;
exports.and = and;
exports.assign = assign;
exports.cancel = cancel;
exports.choose = choose;
exports.createEmptyActor = createEmptyActor;
exports.createInitEvent = createInitEvent;
exports.createInvokeId = createInvokeId;
exports.createSpawner = createSpawner;
exports.done = done;
exports.doneInvoke = doneInvoke;
exports.error = error;
exports.escalate = escalate;
exports.evaluateGuard = evaluateGuard;
exports.flatten = flatten;
exports.formatInitialTransition = formatInitialTransition;
exports.formatTransition = formatTransition;
exports.formatTransitions = formatTransitions;
exports.forwardTo = forwardTo;
exports.fromCallback = fromCallback;
exports.fromEventObservable = fromEventObservable;
exports.fromObservable = fromObservable;
exports.fromPromise = fromPromise;
exports.fromTransition = fromTransition;
exports.getCandidates = getCandidates;
exports.getConfiguration = getConfiguration;
exports.getDelayedTransitions = getDelayedTransitions;
exports.getInitialConfiguration = getInitialConfiguration;
exports.getPersistedState = getPersistedState;
exports.getStateNodeByPath = getStateNodeByPath;
exports.getStateNodes = getStateNodes;
exports.initEvent = initEvent;
exports.interpret = interpret;
exports.invoke = invoke$1;
exports.isActorRef = isActorRef;
exports.isErrorEvent = isErrorEvent;
exports.isInFinalState = isInFinalState;
exports.isSignal = isSignal;
exports.isStateId = isStateId;
exports.isString = isString;
exports.log = log;
exports.macrostep = macrostep;
exports.mapValues = mapValues;
exports.matchesState = matchesState;
exports.memo = memo;
exports.microstep = microstep;
exports.not = not;
exports.or = or;
exports.pathToStateValue = pathToStateValue;
exports.pure = pure;
exports.raise = raise;
exports.resolveActionObject = resolveActionObject;
exports.resolveActionsAndContext = resolveActionsAndContext;
exports.resolveReferencedActor = resolveReferencedActor;
exports.resolveStateValue = resolveStateValue;
exports.send = send;
exports.sendParent = sendParent;
exports.sendTo = sendTo;
exports.startSignal = startSignal;
exports.startSignalType = startSignalType;
exports.stateIn = stateIn;
exports.stop = stop;
exports.stopSignal = stopSignal;
exports.stopSignalType = stopSignalType;
exports.toActionObject = toActionObject;
exports.toActionObjects = toActionObjects;
exports.toActorRef = toActorRef;
exports.toArray = toArray;
exports.toGuardDefinition = toGuardDefinition;
exports.toInvokeConfig = toInvokeConfig;
exports.toObserver = toObserver;
exports.toTransitionConfigArray = toTransitionConfigArray;
exports.transitionNode = transitionNode;
