import Synth from '../modules/Synth';
import Mixer from '../modules/Mixer';
import Oscillator from '../modules/Oscillator';
import VCA from '../modules/VCA';
import Envelope from '../modules/Envelope';
import Filter from '../modules/Filter';
import LFO from '../modules/LFO';
import Phaser from '../modules/TunaPhaser';
import Overdrive from '../modules/TunaOverdrive';
import Delay from '../modules/Delay';
import Sequencer from '../modules/Sequencer';
import ComputerKeyboard from '../modules/ComputerKeyboard';
import MIDIController from '../modules/MIDIController';
import param from '../helpers/param';
import Ringmod from '../modules/Ringmod';
import FrequencyAnalyzer from '../modules/FrequencyAnalyzer';

export default class Cyanide {
  constructor() {
    this.synth = new Synth();
    this.mixer = new Mixer(1);
    this.osc = new Oscillator('OSC 1');
    this.vca = new VCA();
    this.volumeEnvelope = new Envelope();
    this.filter = new Filter();
    this.lfo1 = new LFO('LFO 1');
    this.lfo2 = new LFO('LFO 2');
    this.ringmod = new Ringmod();
    this.overdrive = new Overdrive();
    this.phaser = new Phaser();
    this.delay = new Delay();
    this.sequencer = new Sequencer(90);
    this.frequencyAnalyzer = new FrequencyAnalyzer();

    this.computerKeyboard = new ComputerKeyboard(2);
    this.midiController = new MIDIController();

    const {
      synth,
      mixer,
      osc,
      vca,
      volumeEnvelope,
      filter,
      lfo1,
      lfo2,
      overdrive,
      phaser,
      delay,
      sequencer,
      computerKeyboard,
      midiController,
      ringmod,
      frequencyAnalyzer,
    } = this;

    synth.connect(osc).to(mixer.channel(1));

    synth
      .connect(mixer)
      .to(vca)
      .to(filter)
      .to(overdrive)
      .to(ringmod)
      .to(phaser)
      .to(delay)
      .output();

    synth.addModule(lfo1);
    synth.addModule(lfo2);
    synth.addModule(sequencer);
    synth.addModule(frequencyAnalyzer);

    volumeEnvelope.modulate(vca::param('gain'));

    computerKeyboard.triggerOnPress([
      osc::osc.setFrequency,
      volumeEnvelope::volumeEnvelope.triggerADS,
      freq => sequencer.triggerAtSelectedStep(() => {
        osc.setFrequency(freq);
        volumeEnvelope.trigger();
      }),
    ]);

    computerKeyboard.triggerOnRelease([
      volumeEnvelope::volumeEnvelope.triggerRelease,
    ]);

    midiController.triggerOnPress([
      osc::osc.setFrequency,
      volumeEnvelope::volumeEnvelope.triggerADS,
      freq => sequencer.triggerAtSelectedStep(() => {
        osc.setFrequency(freq);
        volumeEnvelope.trigger();
      }),
    ]);

    midiController.triggerOnRelease([
      volumeEnvelope::volumeEnvelope.triggerRelease,
    ]);
  }
}
