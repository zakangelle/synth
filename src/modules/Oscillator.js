import ctx from 'audio-context';
import applyParams from '../helpers/applyParams';

/**
 * Thin wrapper around the OscillatorNode API that exposes
 * convenient methods for interacting with parameters
 */
export default class Oscillator {
  defaults = {
    type: 'sine',
    frequency: 440,
    detune: 0,
  }

  constructor(params = {}) {
    this.node = ctx().createOscillator();

    this::applyParams(params);
    this.start();
  }

  /**
   * Proxy start() to oscillator node
   * @return {Oscillator}
   */
  start() {
    this.node.start();

    return this;
  }

  /**
   * Proxy stop() to oscillator node
   * @return {Oscillator}
   */
  stop() {
    this.node.stop();

    return this;
  }

  /**
   * Set frequency value in hertz
   * @param {number} frequency
   * @return {Oscillator}
   */
  setFrequency(frequency) {
    this.node.frequency.value = frequency;

    return this;
  }

  /**
   * Set detune value in cents
   * @param {number} detune
   * @return {Oscillator}
   */
  setDetune(detune) {
    this.node.detune.value = detune;

    return this;
  }

  /**
   * Set waveform type
   * @param {string} type
   * @return {Oscillator}
   */
  setType(type) {
    this.node.type = type;

    return this;
  }

  /**
   * Get frequency value
   * @return {number}
   */
  getFrequency() {
    return this.node.frequency.value;
  }

  /**
   * Get detune value
   * @return {number}
   */
  getDetune() {
    return this.node.detune.value;
  }

  /**
   * Get waveform type
   * @return {string}
   */
  getType() {
    return this.node.type;
  }
}
