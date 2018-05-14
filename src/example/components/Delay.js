import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AudioControlGroup from './AudioControlGroup';
import Slider from './Slider';

export default class Delay extends Component {
  static propTypes = {
    delay: PropTypes.object.isRequired, // eslint-disable-line
  }

  render() {
    const { delay } = this.props;

    return (
      <AudioControlGroup label={delay.name}>
        <Slider
          label="Time"
          defaultValue={0.5}
          min={0.01}
          max={1}
          step={0.01}
          onChange={delay::delay.setDelayTime}
        />

        <Slider
          label="Feedback"
          defaultValue={0.25}
          min={0}
          max={1}
          step={0.01}
          onChange={delay::delay.setFeedback}
        />

        <Slider
          label="Mix"
          defaultValue={0}
          min={0}
          max={1}
          step={0.01}
          onChange={delay::delay.setWetDryMix}
        />
      </AudioControlGroup>
    );
  }
}
