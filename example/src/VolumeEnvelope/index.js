import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AudioControlGroup from '../common/AudioControlGroup';
import Slider from '../common/Slider';

export default class VolumeEnvelope extends Component {
  static propTypes = {
    envelope: PropTypes.shape({
      attack: PropTypes.number,
      decay: PropTypes.number,
      sustain: PropTypes.number,
      release: PropTypes.number,
      destination: PropTypes.object.isRequired, // eslint-disable-line
    }).isRequired,
  }

  render() {
    const { envelope } = this.props;

    return (
      <AudioControlGroup label="Volume Envelope">
        <Slider
          label="A"
          defaultValue={0}
          min={0}
          max={10}
          step={0.1}
          vertical
          onChange={envelope::envelope.setAttack}
        />

        <Slider
          label="D"
          defaultValue={0.1}
          min={0.001}
          max={1}
          step={0.001}
          vertical
          onChange={envelope::envelope.setDecay}
        />

        <Slider
          label="S"
          defaultValue={1}
          min={0}
          max={1}
          step={0.001}
          vertical
          onChange={envelope::envelope.setSustain}
        />

        <Slider
          label="R"
          defaultValue={0.1}
          min={0}
          max={10}
          step={0.1}
          vertical
          onChange={envelope::envelope.setRelease}
        />
      </AudioControlGroup>
    );
  }
}
