/* global document, Event */
import $ from 'jquery';
import App from '../app';
// import Game from '../game';

/**
 * @test {App}
 */
describe('App', () => {
  const instance = new App();

  /**
   * @test {App#constructor}
   */
  it('.constructor()', () => {
    expect(instance).toBeDefined();
  });

  /**
   * @test {App#load}
   */
  it('.load()', () => {
    instance.readyCallback = jest.fn();
    instance.load();
    expect(instance.loginButton.click).toBeDefined();
    expect(instance.createButton.click).toBeDefined();
    expect(instance.wrapper.click).toBeDefined();
    expect(instance.yes.click).toBeDefined();
    expect(instance.no.click).toBeDefined();
    expect(instance.rememberMe.click).toBeDefined();
    expect(instance.guest.click).toBeDefined();
    expect(instance.registerButton.click).toBeDefined();
    expect(instance.cancelButton.click).toBeDefined();
    expect(instance.about.click).toBeDefined();
    expect(instance.credits.click).toBeDefined();
    expect(instance.git.click).toBeDefined();
    expect(instance.respawn.click).toBeDefined();
    expect(instance.canvas.click).toBeDefined();
  });

  /**
   * @test {App#welcomeContinue}
   */
  it('.welcomeContinue()', () => {
    expect(instance.welcomeContinue()).toEqual(false);
    instance.game = {
      storage: {
        data: {},
        save: jest.fn(),
      },
    };
    instance.body.addClass('welcomeMessage');
    expect(instance.game.storage.data.welcome).toEqual(undefined);
    expect(instance.body[0].className).toEqual('welcomeMessage');

    expect(instance.welcomeContinue()).toEqual(true);
    expect(instance.game.storage.data.welcome).toEqual(false);
    expect(instance.body[0].className).toEqual('');
  });

  /**
   * @test {App#login}
   */
  it('.login()', () => {
    expect(instance.login()).toEqual(false);

    instance.logginIn = false;
    expect(instance.logginIn).toEqual(false);

    instance.game = {
      loaded: true,
      connect: jest.fn(),
    };

    expect(instance.statusMessage).toEqual('You should turn back now...');
    instance.statusMessage = null;

    expect(instance.login()).toEqual(true);
  });

  /**
   * @test {App#loginAsGuest}
   */
  it('.loginAsGuest()', () => {
    instance.game = null;
    expect(instance.loginAsGuest()).toEqual(false);
    instance.game = {};
    expect(instance.loginAsGuest()).toEqual(true);
  });

  /**
   * @test {App#loadCharacter}
   */
  it('.loadCharacter()', () => {
    expect(instance.loadCharacter()).toEqual(false);
  });

  /**
   * @test {App#rememberLogin}
   */
  it('.rememberMe()', () => {
    expect(instance.rememberLogin()).toEqual(false);
    instance.game = {
      storage: {
        toggleRemember: jest.fn(),
      },
    };
    expect(instance.rememberLogin()).toEqual(true);
  });

  /**
   * @test {App#respawnPlayer}
   */
  it('.respawn()', () => {
    expect(instance.respawnPlayer()).toEqual(false);
    instance.game = {
      player: {
        dead: true,
      },
      respawn: jest.fn(),
    };
    expect(instance.respawnPlayer()).toEqual(true);
  });

  /**
   * @test {App#keydownEventListener}
   */
  it('.keydownEventListener()', () => {
    instance.game = false;
    expect(instance.keydownEventListener(new Event('keydown'))).toEqual(false);
    instance.game = {};
    expect(instance.keydownEventListener(new Event('keydown'))).toEqual(true);
  });

  /**
   * @test {App#keyupEventListener}
   */
  it('.keyupEventListener()', () => {
    expect(instance.keyupEventListener(new Event('keyup'))).toEqual(false);
    instance.game = {
      started: true,
      input: {
        keyUp: jest.fn(),
      },
    };
    expect(instance.keyupEventListener(new Event('keyup'))).toEqual(true);
  });

  /**
   * @test {App#mousemoveEventListener}
   */
  it('.keyupEventListener()', () => {
    instance.game = null;
    expect(instance.mousemoveEventListener(new Event('mousemove'))).toEqual(false);

    const setCoords = jest.fn();
    const moveCursor = jest.fn();
    instance.game = {
      started: true,
      input: {
        setCoords,
        moveCursor,
      },
    };

    expect(instance.mousemoveEventListener(new Event('mousemove'))).toEqual(true);
    expect(moveCursor).toBeCalled();
    expect(setCoords).toBeCalled();
  });

  /**
   * @test {App#canvasClickEventListener}
   */
  it('.canvasClickEventListener()', () => {
    const event = {
      button: 0,
    };

    instance.game = null;
    expect(instance.canvasClickEventListener(event)).toEqual(false);

    instance.game = {
      started: true,
      input: {
        handle: jest.fn(),
      },
    };

    expect(instance.canvasClickEventListener(event)).toEqual(true);
  });

  /**
   * @test {App#zoom}
   */
  it('.zoom()', () => {
    instance.border.css = jest.fn();
    instance.zoom();
    expect(instance.border.css).toHaveBeenCalled();
  });

  /**
   * #test {App#fadeMenu}
   */
  it('.fadeMenu()', () => {
    instance.updateLoader = jest.fn();
    instance.fadeMenu();
    expect(instance.updateLoader).toHaveBeenCalled();
  });

  /**
   * @test {App#showMenu}
   */
  it('.showMenu()', () => {
    const addClass = jest.spyOn(instance.body, 'addClass');
    const removeClass = jest.spyOn(instance.body, 'removeClass');

    instance.showMenu();
    expect(removeClass).toHaveBeenCalled();
    expect(addClass).toHaveBeenCalled();
  });

  /**
   * @test {App#displayScreen}
   */
  it('.displayScreen()', () => {
    expect(instance.displayScreen()).toEqual(false);

    instance.loggingIn = true;
    expect(instance.displayScreen('logging in fail')).toEqual(false);
    instance.loggingIn = false;

    // make our DOM elments since this is headless...
    const loadCharacter = document.createElement('div');
    loadCharacter.setAttribute('id', 'loadCharacter');
    document.body.appendChild(loadCharacter);

    const createCharacter = document.createElement('div');
    createCharacter.setAttribute('id', 'createCharacter');
    document.body.appendChild(createCharacter);

    // toggle off loading character
    expect(instance.displayScreen('loadCharacter', 'createCharacter')).toEqual(true);
    expect(loadCharacter.style.display).toEqual('none');
    expect(createCharacter.style.display).toEqual('block');

    // toggle off creating character
    expect(instance.displayScreen('createCharacter', 'loadCharacter')).toEqual(true);
    expect(loadCharacter.style.display).toEqual('block');
    expect(createCharacter.style.display).toEqual('none');
  });

  /**
   * @test {App#displayScroll}
   */
  it('.displayScroll()', () => {
    // mock the displayScreen function
    const displayScreen = jest.spyOn(instance, 'displayScreen');

    // make sure the wrapper has a valid DOM element
    const mockWrapper = document.createElement('div');
    mockWrapper.setAttribute('id', 'wrapper');
    document.body.appendChild(mockWrapper);
    instance.wrapper = $(mockWrapper);

    // make sure the wrapper has a valid DOM element
    const mockHelpButton = document.createElement('button');
    mockHelpButton.setAttribute('id', 'helpButton');
    document.body.appendChild(mockHelpButton);
    instance.helpButton = $(mockHelpButton);

    // game is not started
    instance.game.started = false;

    // state is not set
    expect(instance.wrapper.attr('class')).not.toEqual('animate');

    instance.displayScroll('createCharacter');
    expect(displayScreen).toHaveBeenCalled();
    expect(displayScreen.mock.calls[0]).toEqual([undefined, 'createCharacter']);

    // state is set to animate
    instance.wrapper.removeClass().addClass('animate');
    expect(instance.wrapper.attr('class')).toEqual('animate');

    instance.displayScroll('createCharacter');
    expect(displayScreen).toHaveBeenCalled();
    expect(displayScreen.mock.calls[0]).toEqual([undefined, 'createCharacter']);

    // game has started
    instance.game.started = true;

    // expect the body to have no class
    expect(instance.body.attr('class')).toEqual('intro');

    // help button should have an active class
    instance.helpButton.addClass('active');
    expect(instance.helpButton.attr('class')).toEqual('active');

    instance.displayScroll('createCharacter');
    expect(displayScreen).toHaveBeenCalled();
    expect(displayScreen.mock.calls[0]).toEqual([undefined, 'createCharacter']);

    // help button should have no active class
    expect(instance.helpButton.attr('class')).toEqual('');

    // the game has a player
    instance.game.player = {};
    instance.displayScroll('createCharacter');
    expect(displayScreen).toHaveBeenCalled();
    expect(displayScreen.mock.calls[0]).toEqual([undefined, 'createCharacter']);

    // expect the body to have the player death class
    expect(instance.body.attr('class')).toEqual('intro death');
  });

  /**
   * @test {App#verifyForm}
   */
  it('.verifyForm()', () => {
    instance.getActiveForm = jest.fn().mockReturnValue('null');
    expect(instance.verifyForm()).toEqual(true);
  });

  /**
   * @test {App#verifyJoinForm}
   */
  it('.verifyJoinForm', () => {
    const sendError = jest.spyOn(instance, 'sendError');
    expect(instance.verifyJoinForm()).toEqual(false);
    expect(sendError).toHaveBeenCalledWith({}, 'A username is necessary you silly.');
  });

  /**
   * @test {App#verifyLoginForm}
   */
  it('.verifyLoginForm', () => {
    const sendError = jest.spyOn(instance, 'sendError');
    instance.isGuest = jest.fn().mockReturnValue(true);
    expect(instance.verifyLoginForm()).toEqual(true);

    instance.isGuest = jest.fn().mockReturnValue(false);
    expect(instance.verifyLoginForm()).toEqual(false);
    expect(sendError).toHaveBeenCalledWith({}, 'Please enter a username.');
  });

  /**
   * @test {App#cleanErrors}
   */
  it('.cleanErrors()', () => {
    expect(instance.loginFields).toBeDefined();
    expect(instance.registerFields).toBeDefined();
    instance.cleanErrors();

    expect(document.querySelectorAll('.field-error').length).toEqual(0);
    expect(document.querySelectorAll('.validation-error').length).toEqual(0);
    expect(document.querySelectorAll('.status').length).toEqual(0);
  });


  /**
   * @test {App#updateRange}
   */
  it('.updateRange()', () => {
    instance.updateRange('test');
    expect(instance.rangeField).toEqual('test');
  });

  /**
   * @test {App#updateOrientation}
   */
  it('.updateOrientation()', () => {
    instance.orientation = 'mobile';
    instance.updateOrientation();
    expect(instance.orientation).toEqual('landscape');
  });
});
