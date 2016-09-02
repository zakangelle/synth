import ctx from 'audio-context';
import Gain from './Gain.js';

export default class Delay
{
  constructor()
  {
    this.delay = ctx.createDelay();
    this.filter = new Filter();
    this.feedback = new Gain();
    this.input = new Gain();
    this.output = new Gain();
    this.dry = new Gain();
    this.wet = new Gain();

    let { delay, filter, feedback, input, dry, wet, output } = this;

    this.inputNode = this.input.node;
    this.outputNode = this.output.node;

    this.inputNode.connect(dry.node);
    dry.node.connect(this.outputNode);

    this.inputNode.connect(delay);
    delay.connect(feedback.node);
    feedback.node.connect(filter.node);
    filter.node.connect(delay)
    delay.connect(wet.node);
    wet.node.connect(this.outputNode);

    //Set filter defaults
    filter.node.setFilterType('lowpass');
    filter.node.setFrequency(1000);

    //Defaults on 'Bootup'
    this.setDelayTime(0.5);
    this.setFeedback(0.5);
    this.setWetDryMix(0.5);
  }

  setFeedback(value)
  {
    this.feedback.setGain(value);
  }

  setDelayTime(time)
  {
    this.delay.delayTime.value = time;
  }

  getFeedback()
  {
    return this.feedback.getGain();
  }

  getDelayTime()
  {
    return this.delay.delayTime.value;
  }

  setBpmSync(bpm,note)
  {
    this.delay.delayTime.value = (60 / bpm) / note;
  }

  setWetDryMix(value)
  {
    this.wet.setGain(0 + value);
    this.dry.setGain(1 - value);
  }

}
