/* global log, _, Packets */

define(function() {
  return Class.extend({
    /**
     * Do not clutter up the Socket class with callbacks,
     * have this class here until a better method arises in my head.
     *
     * This class should not have any complex functionality, its main
     * role is to provide organization for packets and increase readability
     *
     * Please respect the order of the Packets Enum and arrange functions
     * accordingly.
     */

    init(app) {
      var self = this;

      this.app = app;

      this.messages = [];

      this.messages[Packets.Handshake] = this.receiveHandshake;
      this.messages[Packets.Welcome] = this.receiveWelcome;
      this.messages[Packets.Spawn] = this.receiveSpawn;
      this.messages[Packets.Equipment] = this.receiveEquipment;
      this.messages[Packets.List] = this.receiveEntityList;
      this.messages[Packets.Sync] = this.receiveSync;
      this.messages[Packets.Movement] = this.receiveMovement;
      this.messages[Packets.Teleport] = this.receiveTeleport;
      this.messages[Packets.Despawn] = this.receiveDespawn;
      this.messages[Packets.Combat] = this.receiveCombat;
      this.messages[Packets.Animation] = this.receiveAnimation;
      this.messages[Packets.Projectile] = this.receiveProjectile;
      this.messages[Packets.Population] = this.receivePopulation;
      this.messages[Packets.Points] = this.receivePoints;
      this.messages[Packets.Network] = this.receiveNetwork;
      this.messages[Packets.Chat] = this.receiveChat;
      this.messages[Packets.Command] = this.receiveCommand;
      this.messages[Packets.Inventory] = this.receiveInventory;
      this.messages[Packets.Bank] = this.receiveBank;
      this.messages[Packets.Ability] = this.receiveAbility;
      this.messages[Packets.Quest] = this.receiveQuest;
      this.messages[Packets.Notification] = this.receiveNotification;
      this.messages[Packets.Blink] = this.receiveBlink;
      this.messages[Packets.Heal] = this.receiveHeal;
      this.messages[Packets.Experience] = this.receiveExperience;
      this.messages[Packets.Death] = this.receiveDeath;
      this.messages[Packets.Audio] = this.receiveAudio;
      this.messages[Packets.NPC] = this.receiveNPC;
      this.messages[Packets.Respawn] = this.receiveRespawn;
      this.messages[Packets.Enchant] = this.receiveEnchant;
      this.messages[Packets.Guild] = this.receiveGuild;
      this.messages[Packets.Pointer] = this.receivePointer;
      this.messages[Packets.PVP] = this.receivePVP;
      this.messages[Packets.Shop] = this.receiveShop;
    },

    handleData(data) {
      var self = this,
        packet = data.shift();

      if (this.messages[packet] && _.isFunction(this.messages[packet]))
        this.messages[packet].call(self, data);
    },

    handleBulkData(data) {
      var self = this;

      _.each(data, function(message) {
        this.handleData(message);
      });
    },

    handleUTF8(message) {
      var self = this;

      this.app.toggleLogin(false);

      switch (message) {
        case "updated":
          this.app.sendError(null, "The client has been updated!");
          break;

        case "full":
          this.app.sendError(null, "The servers are currently full!");
          break;

        case "error":
          this.app.sendError(null, "The server has responded with an error!");
          break;

        case "development":
          this.app.sendError(
            null,
            "The game is currently in development mode."
          );
          break;

        case "disallowed":
          this.app.sendError(
            null,
            "The server is currently not accepting connections!"
          );
          break;

        case "maintenance":
          this.app.sendError(
            null,
            "WTF?! Adventure is currently under construction."
          );
          break;

        case "userexists":
          this.app.sendError(
            null,
            "The username you have chosen already exists."
          );
          break;

        case "emailexists":
          this.app.sendError(
            null,
            "The email you have chosen is not available."
          );
          break;

        case "loggedin":
          this.app.sendError(null, "The player is already logged in!");
          break;

        case "invalidlogin":
          this.app.sendError(
            null,
            "You have entered the wrong username or password."
          );
          break;

        case "toofast":
          this.app.sendError(
            null,
            "You are trying to log in too fast from the same connection."
          );
          break;

        case "malform":
          this.app.game.handleDisconnection(true);
          this.app.sendError(null, "Client has experienced a malfunction.");
          break;

        case "timeout":
          this.app.sendError(
            null,
            "You have been disconnected for being inactive for too long."
          );
          break;

        case "validatingLogin":
          this.app.sendError(null, "Validating login...");
          break;
        default:
          this.app.sendError(null, "An unknown error has occurred: " + message);
          break;
      }
    },

    /**
     * Data Receivers
     */

    receiveHandshake(data) {
      var self = this;

      if (this.handshakeCallback) this.handshakeCallback(data.shift());
    },

    receiveWelcome(data) {
      var self = this,
        playerData = data.shift();

      if (this.welcomeCallback) this.welcomeCallback(playerData);
    },

    receiveSpawn(data) {
      var self = this;

      if (this.spawnCallback) this.spawnCallback(data);
    },

    receiveEquipment(data) {
      var self = this,
        equipType = data.shift(),
        equipInfo = data.shift();

      if (this.equipmentCallback) this.equipmentCallback(equipType, equipInfo);
    },

    receiveEntityList(data) {
      var self = this;

      if (this.entityListCallback) this.entityListCallback(data);
    },

    receiveSync(data) {
      var self = this;

      if (this.syncCallback) this.syncCallback(data.shift());
    },

    receiveMovement(data) {
      var self = this,
        movementData = data.shift();

      if (this.movementCallback) this.movementCallback(movementData);
    },

    receiveTeleport(data) {
      var self = this,
        teleportData = data.shift();

      if (this.teleportCallback) this.teleportCallback(teleportData);
    },

    receiveDespawn(data) {
      var self = this,
        id = data.shift();

      if (this.despawnCallback) this.despawnCallback(id);
    },

    receiveCombat(data) {
      var self = this,
        combatData = data.shift();

      if (this.combatCallback) this.combatCallback(combatData);
    },

    receiveAnimation(data) {
      var self = this,
        id = data.shift(),
        info = data.shift();

      if (this.animationCallback) this.animationCallback(id, info);
    },

    receiveProjectile(data) {
      var self = this,
        type = data.shift(),
        info = data.shift();

      if (this.projectileCallback) this.projectileCallback(type, info);
    },

    receivePopulation(data) {
      var self = this;

      if (this.populationCallback) this.populationCallback(data.shift());
    },

    receivePoints(data) {
      var self = this,
        pointsData = data.shift();

      if (this.pointsCallback) this.pointsCallback(pointsData);
    },

    receiveNetwork(data) {
      var self = this,
        opcode = data.shift();

      if (this.networkCallback) this.networkCallback(opcode);
    },

    receiveChat(data) {
      var self = this,
        info = data.shift();

      if (this.chatCallback) this.chatCallback(info);
    },

    receiveCommand(data) {
      var self = this,
        info = data.shift();

      if (this.commandCallback) this.commandCallback(info);
    },

    receiveInventory(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.inventoryCallback) this.inventoryCallback(opcode, info);
    },

    receiveBank(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.bankCallback) this.bankCallback(opcode, info);
    },

    receiveAbility(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.abilityCallback) this.abilityCallback(opcode, info);
    },

    receiveQuest(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.questCallback) this.questCallback(opcode, info);
    },

    receiveNotification(data) {
      var self = this,
        opcode = data.shift(),
        message = data.shift();

      if (this.notificationCallback) this.notificationCallback(opcode, message);
    },

    receiveBlink(data) {
      var self = this,
        instance = data.shift();

      if (this.blinkCallback) this.blinkCallback(instance);
    },

    receiveHeal(data) {
      var self = this;

      if (this.healCallback) this.healCallback(data.shift());
    },

    receiveExperience(data) {
      var self = this;

      if (this.experienceCallback) this.experienceCallback(data.shift());
    },

    receiveDeath(data) {
      var self = this;

      if (this.deathCallback) this.deathCallback(data.shift());
    },

    receiveAudio(data) {
      var self = this;

      if (this.audioCallback) this.audioCallback(data.shift());
    },

    receiveNPC(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.npcCallback) this.npcCallback(opcode, info);
    },

    receiveRespawn(data) {
      var self = this,
        id = data.shift(),
        x = data.shift(),
        y = data.shift();

      if (this.respawnCallback) this.respawnCallback(id, x, y);
    },

    receiveEnchant(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.enchantCallback) this.enchantCallback(opcode, info);
    },

    receiveGuild(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.guildCallback) this.guildCallback(opcode, info);
    },

    receivePointer(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.pointerCallback) this.pointerCallback(opcode, info);
    },

    receivePVP(data) {
      var self = this,
        id = data.shift(),
        pvp = data.shift();

      if (this.pvpCallback) this.pvpCallback(id, pvp);
    },

    receiveShop(data) {
      var self = this,
        opcode = data.shift(),
        info = data.shift();

      if (this.shopCallback) this.shopCallback(opcode, info);
    },

    /**
     * Universal Callbacks
     */

    onHandshake(callback) {
      this.handshakeCallback = callback;
    },

    onWelcome(callback) {
      this.welcomeCallback = callback;
    },

    onSpawn(callback) {
      this.spawnCallback = callback;
    },

    onEquipment(callback) {
      this.equipmentCallback = callback;
    },

    onEntityList(callback) {
      this.entityListCallback = callback;
    },

    onSync(callback) {
      this.syncCallback = callback;
    },

    onMovement(callback) {
      this.movementCallback = callback;
    },

    onTeleport(callback) {
      this.teleportCallback = callback;
    },

    onDespawn(callback) {
      this.despawnCallback = callback;
    },

    onCombat(callback) {
      this.combatCallback = callback;
    },

    onAnimation(callback) {
      this.animationCallback = callback;
    },

    onProjectile(callback) {
      this.projectileCallback = callback;
    },

    onPopulation(callback) {
      this.populationCallback = callback;
    },

    onPoints(callback) {
      this.pointsCallback = callback;
    },

    onNetwork(callback) {
      this.networkCallback = callback;
    },

    onChat(callback) {
      this.chatCallback = callback;
    },

    onCommand(callback) {
      this.commandCallback = callback;
    },

    onInventory(callback) {
      this.inventoryCallback = callback;
    },

    onBank(callback) {
      this.bankCallback = callback;
    },

    onAbility(callback) {
      this.abilityCallback = callback;
    },

    onQuest(callback) {
      this.questCallback = callback;
    },

    onNotification(callback) {
      this.notificationCallback = callback;
    },

    onBlink(callback) {
      this.blinkCallback = callback;
    },

    onHeal(callback) {
      this.healCallback = callback;
    },

    onExperience(callback) {
      this.experienceCallback = callback;
    },

    onDeath(callback) {
      this.deathCallback = callback;
    },

    onAudio(callback) {
      this.audioCallback = callback;
    },

    onNPC(callback) {
      this.npcCallback = callback;
    },

    onRespawn(callback) {
      this.respawnCallback = callback;
    },

    onEnchant(callback) {
      this.enchantCallback = callback;
    },

    onGuild(callback) {
      this.guildCallback = callback;
    },

    onPointer(callback) {
      this.pointerCallback = callback;
    },

    onPVP(callback) {
      this.pvpCallback = callback;
    },

    onShop(callback) {
      this.shopCallback = callback;
    }
  });
});
