import 'web-audio-test-api';
import Mousetrap from 'mousetrap';
import ComputerKeyboard from './ComputerKeyboard';

describe('ComputerKeyboard', () => {
  it('should set default octave on boot', () => {
    const kb = new ComputerKeyboard();

    expect(kb.octave).toEqual(3);
  });

  it('should set octave on boot', () => {
    const kb = new ComputerKeyboard(1);

    expect(kb.octave).toEqual(1);
  });

  it('should set octave', () => {
    const kb = new ComputerKeyboard();

    kb.setOctave(2);

    expect(kb.octave).toEqual(2);
  });

  it('should set on press callbacks', () => {
    const kb = new ComputerKeyboard();

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    kb.triggerOnPress([
      callback1,
      callback2,
    ]);

    expect(kb.onPressCallbacks).toEqual([
      callback1,
      callback2,
    ]);
  });

  it('should set up keyboard keydown key bindings', () => {
    const kb = new ComputerKeyboard();
    const spy = jest.spyOn(kb, 'triggerOnPressCallbacks');

    kb.setupKeyBindings();

    Mousetrap.trigger('a', 'keydown');
    Mousetrap.trigger('s', 'keydown');
    Mousetrap.trigger('d', 'keydown');
    Mousetrap.trigger('f', 'keydown');
    Mousetrap.trigger('g', 'keydown');
    Mousetrap.trigger('h', 'keydown');
    Mousetrap.trigger('j', 'keydown');
    Mousetrap.trigger('w', 'keydown');
    Mousetrap.trigger('e', 'keydown');
    Mousetrap.trigger('t', 'keydown');
    Mousetrap.trigger('y', 'keydown');
    Mousetrap.trigger('u', 'keydown');

    expect(spy.mock.calls).toHaveLength(12);

    Mousetrap.trigger('r', 'keydown');
    Mousetrap.trigger('3', 'keydown');
    Mousetrap.trigger('n', 'keydown');

    expect(spy.mock.calls).toHaveLength(12);
  });

  it('should set up keyboard keyup key bindings', () => {
    const kb = new ComputerKeyboard();
    const spy = jest.spyOn(kb, 'triggerOnReleaseCallbacks');

    kb.setupKeyBindings();

    Mousetrap.trigger('a', 'keydown');
    Mousetrap.trigger('a', 'keyup');
    Mousetrap.trigger('s', 'keydown');
    Mousetrap.trigger('s', 'keyup');
    Mousetrap.trigger('d', 'keydown');
    Mousetrap.trigger('d', 'keyup');
    Mousetrap.trigger('f', 'keydown');
    Mousetrap.trigger('f', 'keyup');
    Mousetrap.trigger('g', 'keydown');
    Mousetrap.trigger('g', 'keyup');
    Mousetrap.trigger('h', 'keydown');
    Mousetrap.trigger('h', 'keyup');
    Mousetrap.trigger('j', 'keydown');
    Mousetrap.trigger('j', 'keyup');
    Mousetrap.trigger('w', 'keydown');
    Mousetrap.trigger('w', 'keyup');
    Mousetrap.trigger('e', 'keydown');
    Mousetrap.trigger('e', 'keyup');
    Mousetrap.trigger('t', 'keydown');
    Mousetrap.trigger('t', 'keyup');
    Mousetrap.trigger('y', 'keydown');
    Mousetrap.trigger('y', 'keyup');
    Mousetrap.trigger('u', 'keydown');
    Mousetrap.trigger('u', 'keyup');

    expect(spy.mock.calls).toHaveLength(12);

    Mousetrap.trigger('r', 'keydown');
    Mousetrap.trigger('r', 'keyup');
    Mousetrap.trigger('3', 'keydown');
    Mousetrap.trigger('3', 'keyup');
    Mousetrap.trigger('n', 'keydown');
    Mousetrap.trigger('n', 'keyup');

    expect(spy.mock.calls).toHaveLength(12);
  });

  it('should set up octave up key binding', () => {
    const kb = new ComputerKeyboard();
    const spy = jest.spyOn(kb, 'triggerOctaveChange');

    kb.setupKeyBindings();

    Mousetrap.trigger('z');

    expect(spy).toHaveBeenCalledWith('octaveDown');
  });

  it('should set up octave down key binding', () => {
    const kb = new ComputerKeyboard();
    const spy = jest.spyOn(kb, 'triggerOctaveChange');

    kb.setupKeyBindings();

    Mousetrap.trigger('x');

    expect(spy).toHaveBeenCalledWith('octaveUp');
  });

  it('should trigger on press callbacks', () => {
    const kb = new ComputerKeyboard();

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    kb.triggerOnPress([
      callback1,
      callback2,
    ]);

    kb.triggerOnPressCallbacks('C#2');
    kb.triggerOnPressCallbacks('C#2');

    expect(kb.notesBeingHeld).toEqual(['C#2']);

    kb.triggerOnPressCallbacks('C3');

    expect(kb.notesBeingHeld).toEqual(['C#2', 'C3']);
    expect(kb.holding).toEqual(false);
    expect(kb.noteIsBeingHeld).toEqual(false);

    kb.triggerOnPressCallbacks('C3');
    expect(kb.holding).toEqual(true);
    expect(kb.noteIsBeingHeld).toEqual(true);

    expect(kb.lastNoteHeld).toEqual('C3');

    expect(callback1.mock.calls).toHaveLength(2);
    expect(callback1).toHaveBeenCalledWith(130.81);
    expect(callback1).toHaveBeenCalledWith(69.3);

    expect(kb.justReleased).toEqual(false);
  });

  it('should not re-trigger on press callbacks if note is being held', () => {
    const kb = new ComputerKeyboard();

    const callback = jest.fn();

    kb.triggerOnPress([
      callback,
    ]);

    kb.triggerOnPressCallbacks('C#2');
    kb.triggerOnPressCallbacks('C#2');
    kb.triggerOnPressCallbacks('C#2');

    expect(callback.mock.calls).toHaveLength(1);
  });


  it('should trigger on release callbacks', () => {
    const kb = new ComputerKeyboard();

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    kb.triggerOnRelease([
      callback1,
      callback2,
    ]);

    kb.triggerOnPressCallbacks('E2');
    kb.triggerOnReleaseCallbacks('E2');

    expect(kb.holding).toEqual(false);
    expect(kb.justReleased).toEqual(true);
    expect(kb.glidingBetweenNotes).toEqual(false);

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();

    const spy = jest.spyOn(kb, 'triggerOnPressCallbacks');

    kb.triggerOnPressCallbacks('E2');
    kb.triggerOnPressCallbacks('C2');
    kb.triggerOnReleaseCallbacks('E2');

    expect(kb.glidingBetweenNotes).toEqual(true);
    expect(kb.notesBeingHeld).toEqual(['C2']);
    expect(spy.mock.calls).toHaveLength(3);
    expect(callback1.mock.calls).toHaveLength(1);
    expect(callback2.mock.calls).toHaveLength(1);
  });

  it('should not trigger on release callbacks if no note is being held', () => {
    const kb = new ComputerKeyboard();

    const callback = jest.fn();

    kb.triggerOnRelease([
      callback,
    ]);

    kb.triggerOnReleaseCallbacks('E2');

    expect(callback.mock.calls).toHaveLength(0);
  });

  it('should trigger octave change', () => {
    const kb = new ComputerKeyboard();

    kb.triggerOctaveChange('octaveUp');

    expect(kb.octave).toEqual(4);

    kb.triggerOctaveChange('octaveDown');
    kb.triggerOctaveChange('octaveDown');

    expect(kb.octave).toEqual(2);

    kb.triggerOctaveChange('octaveDown');
    expect(kb.octave).toEqual(1);
    kb.triggerOctaveChange('octaveDown');
    kb.triggerOctaveChange('octaveDown');
    kb.triggerOctaveChange('octaveDown');

    expect(kb.octave).toEqual(1);

    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');
    kb.triggerOctaveChange('octaveUp');

    expect(kb.octave).toEqual(8);
  });

  it('should require octave direction to trigger octave change', () => {
    const kb = new ComputerKeyboard();

    kb.triggerOctaveChange();

    expect(kb.octave).toEqual(3);
  });
});
