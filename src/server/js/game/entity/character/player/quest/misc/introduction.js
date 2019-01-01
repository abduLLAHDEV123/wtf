var Quest = require("../quest"),
  Messages = require("../../../../../../network/messages"),
  Packets = require("../../../../../../network/packets"),
  Utils = require("../../../../../../util/utils");

module.exports = Introduction = Quest.extend({
  init(player, data) {
    var self = this;

    this.player = player;
    this.data = data;

    this.lastNPC = null;

    this._super(player, data);
  },

  load(stage) {
    var self = this;

    if (!this.player.inTutorial()) {
      this.setStage(9999);
      this.update();
      return;
    }

    if (!stage) this.update();
    else this.stage = stage;

    this.loadCallbacks();
  },

  loadCallbacks() {
    var self = this;

    if (this.stage >= 9999) return;

    this.updatePointers();
    this.toggleChat();

    this.onNPCTalk(function(npc) {
      var conversation = this.getConversation(npc.id);

      this.lastNPC = npc;

      npc.talk(conversation);

      this.player.send(
        new Messages.NPC(Packets.NPCOpcode.Talk, {
          id: npc.instance,
          text: conversation
        })
      );

      if (npc.talkIndex > conversation.length) this.progress("talk");
    });

    this.player.onReady(function() {
      this.updatePointers();
    });

    this.player.onDoor(function(destX, destY) {
      if (this.getTask() !== "door") {
        this.player.notify("You cannot go through this door yet.");
        return;
      }

      if (!this.verifyDoor(this.player.x, this.player.y))
        this.player.notify("You are not supposed to go through here.");
      else {
        this.progress("door");
        this.player.teleport(destX, destY, false);
      }
    });

    this.player.onProfile(function(isOpen) {
      if (isOpen) this.progress("click");
    });
  },

  progress(type) {
    var self = this,
      task = this.data.task[this.stage];

    if (!task || task !== type) return;

    if (this.stage === this.data.stages) {
      this.finish();
      return;
    }

    switch (type) {
      case "talk":
        if (this.stage === 4)
          this.player.inventory.add({
            id: 248,
            count: 1,
            ability: -1,
            abilityLevel: -1
          });

        break;
    }

    this.stage++;
    this.clearPointers();
    this.resetTalkIndex(this.lastNPC);

    this.update();
    this.updatePointers();

    this.player.send(
      new Messages.Quest(Packets.QuestOpcode.Progress, {
        id: this.id,
        stage: this.stage,
        isQuest: true
      })
    );
  },

  isFinished() {
    return this._super() || !this.player.inTutorial();
  },

  toggleChat() {
    this.player.canTalk = !this.player.canTalk;
  },

  setStage(stage) {
    var self = this;

    this._super(stage);

    this.clearPointers();
  },

  finish() {
    var self = this;

    this.toggleChat();
    this._super();
  },

  verifyDoor(destX, destY) {
    var self = this,
      doorData = this.data.doors[this.stage];

    if (!doorData) return;

    return doorData[0] === destX && doorData[1] === destY;
  },

  onFinishedLoading(callback) {
    this.finishedCallback = callback;
  }
});
