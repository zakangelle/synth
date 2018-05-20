import 'web-audio-test-api';
import Sequencer from './Sequencer';

describe('Sequencer', () => {
  it('should set default bpm', () => {
    const sequencer = new Sequencer();

    expect(sequencer.bpm).toEqual(120);
  });

  it('should set custom bpm', () => {
    const sequencer = new Sequencer(88);

    expect(sequencer.bpm).toEqual(88);
  });

  it('should set bpm', () => {
    const sequencer = new Sequencer();

    sequencer.setBpm(76);

    expect(sequencer.bpm).toEqual(76);
  });

  it('should set selected step', () => {
    const sequencer = new Sequencer();

    sequencer.setSelectedStep(2);

    expect(sequencer.selectedStep).toEqual(2);
  });

  it('should call on step select callbacks', () => {
    const sequencer = new Sequencer();
    const spy = jest.fn();

    sequencer.onStepSelect(spy);
    sequencer.setSelectedStep(6);

    expect(spy).toHaveBeenCalled();
  });

  it('should set on step select callback', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();

    sequencer.onStepSelect(fn);

    expect(sequencer.onStepSelectCallbacks.length).toEqual(1);
    expect(sequencer.onStepSelectCallbacks[0]).toEqual(fn);
  });

  it('should get step interval', () => {
    const sequencer = new Sequencer();
    const sequencer2 = new Sequencer(80);
    const sequencer3 = new Sequencer(250);

    expect(sequencer.getStepInterval()).toEqual(125);
    expect(sequencer2.getStepInterval()).toEqual(187.5);
    expect(sequencer3.getStepInterval()).toEqual(60);
  });

  it('should set trigger callback', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();

    sequencer.trigger(fn);

    expect(sequencer.triggerCallbacks.length).toEqual(1);
    expect(sequencer.triggerCallbacks[0]).toEqual(fn);
  });

  it('should trigger step', () => {
    const sequencer = new Sequencer();
    const spy = jest.fn();

    sequencer.activeStep = 7;

    sequencer.triggerAtStep(7, spy);
    sequencer.triggerStep();

    expect(spy).toHaveBeenCalled();
  });

  it('should not trigger step', () => {
    const sequencer = new Sequencer();
    const spy = jest.fn();

    sequencer.activeStep = 4;

    sequencer.triggerAtStep(9, spy);
    sequencer.triggerStep();

    expect(spy.mock.calls.length).toEqual(0);

    sequencer.activeStep = 9;
    sequencer.triggerStep();

    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should call trigger callbacks', () => {
    const sequencer = new Sequencer();
    const setFrequency = jest.fn();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    sequencer.activeStep = 7;
    sequencer.trigger(callback1);
    sequencer.trigger(callback2);

    sequencer.triggerAtStep(7, setFrequency);
    sequencer.triggerStep();

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it('should set trigger at step', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();

    sequencer.triggerAtStep(10, fn);

    expect(sequencer.stepTriggers[10]).toEqual(fn);
  });

  it('should require step to trigger at step', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();
    const callback = jest.fn();

    sequencer.onSetTrigger(callback);
    sequencer.triggerAtStep(null, fn);

    expect(sequencer.stepTriggers[null]).toEqual(undefined);
    expect(callback.mock.calls.length).toEqual(0);
  });

  it('should call on set trigger callbacks', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    sequencer.onSetTrigger(callback1);
    sequencer.onSetTrigger(callback2);
    sequencer.triggerAtStep(2, fn);

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it('should clear trigger at step', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();

    sequencer.triggerAtStep(5, fn);
    sequencer.clearTriggerAtStep(5);

    expect(sequencer.stepTriggers[5]).toEqual(null);
  });

  it('should trigger at selected step', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();
    const spy = jest.spyOn(sequencer, 'triggerAtStep');

    sequencer.selectedStep = 11;
    sequencer.triggerAtSelectedStep(fn);

    expect(spy).toHaveBeenCalledWith(11, fn);
    expect(sequencer.selectedStep).toEqual(null);
  });

  it('should set on set trigger callback', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();

    sequencer.onSetTrigger(fn);

    expect(sequencer.onSetTriggerCallbacks.length).toEqual(1);
    expect(sequencer.onSetTriggerCallbacks[0]).toEqual(fn);
  });

  it('should start', () => {
    jest.useFakeTimers();

    const sequencer = new Sequencer(120);
    const triggerStep = jest.spyOn(sequencer, 'triggerStep');

    sequencer.start();

    jest.advanceTimersByTime(500);

    expect(triggerStep.mock.calls.length).toEqual(5);
    expect(sequencer.activeStep).toEqual(5);

    jest.advanceTimersByTime(300);

    expect(triggerStep.mock.calls.length).toEqual(7);
    expect(sequencer.activeStep).toEqual(7);

    jest.advanceTimersByTime(1200);

    expect(triggerStep.mock.calls.length).toEqual(17);
    expect(sequencer.activeStep).toEqual(1);
  });

  it('should stop', () => {
    const sequencer = new Sequencer();
    const spy = jest.spyOn(window, 'clearInterval');

    sequencer.activeStep = 8;
    sequencer.stop();

    expect(sequencer.activeStep).toEqual(1);
    expect(spy).toHaveBeenCalledWith(sequencer.sequence);
  });

  it('should clear pattern', () => {
    const sequencer = new Sequencer();
    const fn = jest.fn();

    sequencer.triggerAtStep(1, fn);
    sequencer.triggerAtStep(5, fn);
    sequencer.setSelectedStep(3);

    sequencer.clearPattern();

    expect(sequencer.stepTriggers).toEqual({});
    expect(sequencer.selectedStep).toEqual(null);
  });
});