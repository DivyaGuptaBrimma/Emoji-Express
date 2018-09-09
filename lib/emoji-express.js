'use babel';

import EmojiExpressView from './emoji-express-view';
import { CompositeDisposable } from 'atom';

export default {

  emojiExpressView: null,
  emojiExpressDecoration: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.emojiExpressView = new EmojiExpressView(state.emojiExpressViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.emojiExpressView.getElement(),
      visible: false
    });

    this.thinking = false;
    this.workedTime = new Date();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'emoji-express:toggle': () => this.toggle(),
      'emoji-express:dance': () => this.dance(),
      'emoji-express:rocket': () => this.rocket(),
      'emoji-express:sleepy': () => this.sleepy(),
      'emoji-express:laugh': () => this.laugh(),
      'emoji-express:tongueOut': () => this.tongueOut(),
      'emoji-express:poop': () => this.poop(),
      'emoji-express:cry': () => this.cry(),
      'emoji-express:quirky': () => this.quirky(),
      'emoji-express:think': () => this.think()
    }));

    setInterval( () => {
      let now = new Date();
      if (((now - this.workedTime)/ 1000) > 90) {
        this.think();
        this.thinking = true;
      }
    }, 10000);

    atom.workspace.observeTextEditors(editor => {
      editor.observeCursors (cursor => {
        cursor.onDidChangePosition (event => {

          if(this.thinking) {
            this.checkIfExists('think');
          }

          this.thinking = false;
          this.workedTime = new Date();

          let reactions = {
            dance: ["[dD]ivya", "[dD]ance", "[yY]aay"],
            rocket: ["rock", "launch"],
            sleepy: ["[sS]leepy"],
            laugh: ["[lL]ol"],
            tongueOut: ["\:[pP]"],
            poop: ["poo"],
            cry: ["cry"],
            quirky: ["quirk"],
            think: ["think"]
          }
          //TODO use the hashmap.
          if (
            event.cursor.isInsideWord({ wordRegex: "[dD]ivya" }) ||
            event.cursor.isInsideWord({ wordRegex: "[dD]ance" }) ||
            event.cursor.isInsideWord({ wordRegex: "[yY]aay" })
          ) {
            this.decorateEmojiMarker('dance',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "[sS]leepy" })) {
            this.decorateEmojiMarker('sleepy',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "[lL]ol" })) {
            this.decorateEmojiMarker('laugh',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "\:[pP]" })) {
            this.decorateEmojiMarker('tongueOut',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "poo" })) {
            this.decorateEmojiMarker('poop',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "cry" })) {
            this.decorateEmojiMarker('cry',editor, event)
          }
          else if (
            event.cursor.isInsideWord({ wordRegex: "[rR]ock" }) ||
            event.cursor.isInsideWord({ wordRegex: "[lL]aunch" })
          ) {
            this.decorateEmojiMarker('rocket',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "quirk" })) {
            this.decorateEmojiMarker('quirky',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "[tT]hink" })) {
            this.decorateEmojiMarker('think',editor, event)
          }
          else {
            if (this.emojiExpressDecoration) {
              this.emojiExpressDecoration.destroy()
            }
          }
        })
      })
    })

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.emojiExpressView.destroy();
  },

  serialize() {
    return {
      emojiExpressViewState: this.emojiExpressView.serialize()
    };
  },

  toggle() {
  },

  decorateEmojiMarker(name, editor, event) {
    let element = this.getEmoji(name);
    this.emojiExpressDecoration = editor.decorateMarker(event.cursor.getMarker(), {
      type: 'overlay',
      class: 'my-line-class',
      item:element
    })
  },

  dance() {
    this.createEmoji('dance');
  },

  cry() {
    this.createEmoji('cry');
  },

  quirky() {
    this.createEmoji('quirky');
  },

  poop() {
    this.createEmoji('poop');
  },

  rocket() {
    this.createEmoji('rocket');
  },

  sleepy() {
    this.createEmoji('sleepy');
  },

  laugh() {
    this.createEmoji('laugh');
  },

  tongueOut() {
    this.createEmoji('tongue-out');
  },

  think() {
    this.createEmoji('think');
  },

  checkIfExists(name) {
    let emojiExpressElements = document.getElementsByClassName('emoji-express');

    if (emojiExpressElements.length > 0 ) {
      if (!(this.checkIfEmojiExists(name, emojiExpressElements[0]))) {
        return false;
      }
      emojiExpressElements[0].remove();
      return true;
    }
    return false;
  },

  checkIfEmojiExists(name, emojiElement) {
    if (emojiElement.getElementsByClassName(name).length > 0) {
      return true;
    }
    return false;
  },

  createEmoji(name) {
    if (this.checkIfExists(name)) {
      return;
    }
    let workspace = atom.workspace.getActivePane().getElement()
    let element = this.getEmoji(name);

    workspace.appendChild(element);

  },

  getEmoji(name) {
    return this.emojiExpressView.getElement(name);
  }

};
