const test = require('ava')
const stated = require('./index')

const states = {
  initial: {
    FROZEN: 'ice',
    BOILED: 'steam',
    value: '60F'
  },
  ice: {
    BOILED: 'steam',
    WARMED: 'initial',
    value: '32F'
  },
  steam: {
    COOLED: 'initial',
    FROZEN: 'ice',
    value: {
      temp: '212F'
    }
  }
}

test('newly created instance', t => {
  t.plan(4)
  const state = stated(states)
  t.truthy(state, 'Stated created successfully')
  t.is(state.state, 'initial',
    'initial state is correct')
  t.is(state.value, '60F',
    'value is correctly set to states value')
  t.deepEqual(state.actions, { FROZEN: 'FROZEN', BOILED: 'BOILED' },
    'initial actions are correct')
})

test('transition to new state', t => {
  t.plan(3)
  const state = stated(states)
  state.has(state.actions.FROZEN)
  t.is(state.state, 'ice',
    'transitioned to new state successfully')
  t.is(state.value, '32F',
    'value is correctly set to states value')
  t.deepEqual(state.actions, { BOILED: 'BOILED', WARMED: 'WARMED' },
    'updated actions are correct')
})

test('has allows an update to state w/ primitive', t => {
  t.plan(1)
  const state = stated(states)
  state.has(state.actions.FROZEN, '75F')
  t.is(state.value, '75F',
    'value is correctly set to states value')
})

test('has allows an update to state w/ object', t => {
  t.plan(1)
  const state = stated(states)
  state.has(state.actions.BOILED, { state: 'gas' })
  t.deepEqual(state.value, { temp: '212F', state: 'gas' },
    'value is correctly set to states value')
})

test('return to initial state', t => {
  t.plan(1)
  const state = stated(states)
  state.has(state.actions.FROZEN)
  state.initial()
  t.is(state.value, '60F', 'value is correctly set to initial value')
})

test('transition to new state using to', t => {
  t.plan(2)
  const state = stated(states)
  state.to(state.actions.FROZEN)
  t.is(state.state, 'ice',
    'transitioned to new state successfully')
  t.deepEqual(state.actions, { BOILED: 'BOILED', WARMED: 'WARMED' },
    'updated actions are correct')
})

test('to allows an update to state w/ primitive', t => {
  t.plan(1)
  const state = stated(states)
  state.to(state.actions.FROZEN, '32F')
  t.is(state.value, '32F',
    'value is correctly set to states value')
})

test('to allows an update to state w/ object', t => {
  t.plan(1)
  const state = stated(states)
  state.to(state.actions.BOILED, { state: 'gas' })
  t.deepEqual(state.value, { temp: '212F', state: 'gas' },
    'value is correctly set to states value')
})

test('transition to new state using is', t => {
  t.plan(2)
  const state = stated(states)
  state.is(state.actions.FROZEN)
  t.is(state.state, 'ice',
    'transitioned to new state successfully')
  t.deepEqual(state.actions, { BOILED: 'BOILED', WARMED: 'WARMED' },
    'updated actions are correct')
})

test('is allows an update to state w/ primitive', t => {
  t.plan(1)
  const state = stated(states)
  state.is(state.actions.FROZEN, '32F')
  t.is(state.value, '32F',
    'value is correctly set to states value')
})

test('is allows an update to state w/ object', t => {
  t.plan(1)
  const state = stated(states)
  state.is(state.actions.BOILED, { state: 'gas' })
  t.deepEqual(state.value, { temp: '212F', state: 'gas' },
    'value is correctly set to states value')
})

test('export as object', t => {
  t.plan(1)
  const { Stated } = require('./index')
  const state = new Stated(states)
  state.is(state.actions.FROZEN, '75F')
  t.is(state.value, '75F',
    'value is correctly set to states value')
})

test('emits "transition" event when state is changed', t => {
  t.plan(3)
  const state = stated(states)
  state.on('transition', ({ state, actions, value }) => {
    t.truthy(actions.BOILED,
      '"actions" property is available on the argument')
    t.is(state, 'ice',
      'correct state is applied and passed')
    t.is(value, '75F',
      '"transition" event passes the stated object as the cb argument')
  })
  state.is(state.actions.FROZEN, '75F')
})
