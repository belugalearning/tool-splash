require.config({
    paths: {
        'instructioncontainer': '../../tools/splash/instruction-container',
        'instructiondragbutton': '../../tools/splash/instruction-drag-button',
        'instructiondraggable': '../../tools/splash/instruction-draggable',
        'instructionticker': '../../tools/splash/instruction-ticker',
        'instructiondraggable': '../../tools/splash/instruction-draggable',
        'scrollbar': '../../tools/splash/scroll-bar',
        'splashnode': '../../tools/splash/splash-node',
        'arrow': '../../tools/splash/arrow',
        'controllayer': '../../tools/splash/control-layer',
        'tracenode': '../../tools/splash/trace-node',
        'constants': '../../tools/splash/constants'
    }
});

define(['exports', 'cocos2d', 'qlayer', 'toollayer', 'instructioncontainer', 'instructiondragbutton', 'instructiondraggable', 'instructionticker', 'splashnode', 'blbutton', 'constants' ], function (exports, cc, QLayer, ToolLayer, InstructionContainer, InstructionDragButton, InstructionDraggable, InstructionTicker, SplashNode, BLButton, constants) {
    'use strict';

    var InstructionTypes = constants["InstructionTypes"];

    var defaultButtonZOrder = 1;
    var foregroundZOrder = 100;

    window.bl.toolTag = 'splash';
    var Tool = ToolLayer.extend({

        _windowSize: undefined,
        _background: undefined,
        _backgroundLayer: undefined,

        init: function () {
            var self = this;

            this._super();

            this.setTouchEnabled(true);

            this._windowSize = cc.Director.getInstance().getWinSize();

            cc.Director.getInstance().setDisplayStats(true);

            this.setQuestion();

            this.following = true;

            this.placed = false;

            return this;
        },

        reset: function () {
            this._super();
        },

        getState: function () {
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },

        setQuestion: function () {

            this.setBackground(window.bl.getResource('deep_water_background'));

            this.instructionContainer = new InstructionContainer();
            this.instructionContainer.setPosition(this._windowSize.width/2, this.instructionContainer.getContentSize().height/2 + 10);
            this.instructionContainer.setZOrder(1);
            this.addChild(this.instructionContainer);

            this.setupInstructionButtons();

            this.instructionTicker = new InstructionTicker();
            this.instructionTicker.setPosition(this._windowSize.width/2, 175);
            this.instructionTicker.setZOrder(2);
            this.addChild(this.instructionTicker);

            this.splashNode = new SplashNode();
            var topOfTicker = this.instructionTicker.getBoundingBox().origin.y + this.instructionTicker.getBoundingBox().size.height;
            this.splashNode.setPosition(this.getContentSize().width/2, (topOfTicker + this.getContentSize().height)/2);
            this.addChild(this.splashNode);

            this.setupPlayControls();

        },

        setupInstructionButtons:function() {
            for (var i = 0; i < this.instructionContainer.buttons.length; i++) {
                this.setInstructionTouchFunctions(this.instructionContainer.buttons[i]);
            };
        },

        setInstructionTouchFunctions:function(button) {
            var self = this;

            var highlighting = false;

            button.setEnabled(false);

            button.onTouchDown(function(touchLocation) {
                this.removeFromParent();
                self.addChild(this);
                this.setPosition(touchLocation);
                this.setVisible(true);
                this.setZOrder(foregroundZOrder);
            });

            button.onMoved(function(touchLocation) {
                if (self.instructionTicker.touched(touchLocation)) {
                    var touchRelative = self.instructionTicker.convertToNodeSpace(touchLocation);
                    self.instructionTicker.highlightHovered(touchRelative);
                    highlighting = true;
                } else {
                    if (highlighting) {
                        self.instructionTicker.clearHighlight();
                        highlighting = false;
                    };
                };
            });

            button.onMoveEnded(function(touchLocation) {
                self.reorderChild(button, defaultButtonZOrder);
                if (self.instructionTicker.touched(touchLocation) && !self.following) {
                    var touchRelative = self.instructionTicker.convertToNodeSpace(touchLocation);
                    this.removeFromParent();
                    if (this.type["replace_with"] !== undefined) {
                        var replaceInstructions = [];
                        for (var i = 0; i < this.type["replace_with"].length; i++) {
                            var replaceType = this.type["replace_with"][i];
                            var replaceInstruction = new InstructionDraggable();
                            replaceInstruction.initWithType(InstructionTypes[replaceType]);
                            replaceInstructions.push(replaceInstruction);
                        };
                        for (var i = 0; i < replaceInstructions.length; i++) {
                            replaceInstructions[i].linked = _.without(replaceInstructions, replaceInstructions[i]);
                        };
                        self.instructionTicker.dropInInstructionBoxes(replaceInstructions, touchRelative);                  
                    } else {
                        self.instructionTicker.dropInInstructionBoxes([this], touchRelative);
                        this.linked = [];
                    };
                } else {
                    this.removeFromParent();
                };
                button.setupDraggable();
                self.setInstructionTouchFunctions(button);
                if (highlighting) {
                    self.instructionTicker.clearHighlight();
                    highlighting = false;
                };
            });
        },

        setupPlayControls:function() {
            var self = this;

            var play = function(speed) {
                if (self.following) {
                    self.splashNode.arrow.setSpeed(speed);
                    var speedAction = self.getActionManager().getActionByTag("speed", self.splashNode.arrow);
                    if (speedAction !== null) {
                        speedAction.setSpeed(speed);
                    };
                    self.getActionManager().resumeTarget(self.splashNode.arrow);
                } else {
                    if (self.instructionTicker.valid) {
                        self.splashNode.reset();
                        var arrow = self.splashNode.arrow;
                        arrow.speed = speed;
                        var instructions = self.instructionTicker.instructions;
                        arrow.followInstructions(instructions);
                    } else {
                        self.instructionTicker.showInvalidBrackets();
                    };
                };
            };

            var playButtonPanel = new cc.Sprite();
            playButtonPanel.initWithFile(window.bl.getResource('play_button_panel'));
            playButtonPanel.setPosition(this._windowSize.width - playButtonPanel.getContentSize().width/2, 700);
            this.addChild(playButtonPanel);

            var playButton = new BLButton();
            playButton.initWithFile(window.bl.getResource('play_button'));
            playButton.setPosition(cc.pAdd(playButtonPanel.getAnchorPointInPoints(), cc.p(0, -1)));
            playButtonPanel.addChild(playButton);

            playButton.onTouchUp(function() {
                play(1);
            });

            var pauseButtonPanel = new cc.Sprite();
            pauseButtonPanel.initWithFile(window.bl.getResource('play_button_panel'));
            pauseButtonPanel.setPosition(this._windowSize.width - pauseButtonPanel.getContentSize().width/2, 610);
            this.addChild(pauseButtonPanel);

            var pauseButton = new BLButton();
            pauseButton.initWithFile(window.bl.getResource('pause_button'));
            pauseButton.setPosition(cc.pAdd(pauseButtonPanel.getAnchorPointInPoints(), cc.p(0, -1)));
            pauseButtonPanel.addChild(pauseButton);
            pauseButton.onTouchUp(function() {
                    self.getActionManager().pauseTarget(self.splashNode.arrow);
                }
            );

            var fastForwardButton = new BLButton();
            fastForwardButton.initWithFile(window.bl.getResource('fastforward_button'));
            fastForwardButton.setPosition(this._windowSize.width - fastForwardButton.getContentSize().width/2, 520);
            this.addChild(fastForwardButton);

            fastForwardButton.onTouchUp(function() {
                play(8);
            });

            var stopButtonPanel = new cc.Sprite();
            stopButtonPanel.initWithFile(window.bl.getResource('play_button_panel'));
            stopButtonPanel.setPosition(this._windowSize.width - stopButtonPanel.getContentSize().width/2, 430);
            this.addChild(stopButtonPanel);

            var stopButton = new BLButton();
            stopButton.initWithFile(window.bl.getResource('stop_button'));
            stopButton.setPosition(cc.pAdd(stopButtonPanel.getAnchorPointInPoints(), cc.p(0, -1)));
            stopButtonPanel.addChild(stopButton);
            stopButton.onTouchUp(function() {
                self.splashNode.reset();
            });

            var clearButton = new BLButton();
            clearButton.initWithFile(window.bl.getResource('reset_button'));
            clearButton.setPosition(this._windowSize.width - clearButton.getContentSize().width/2, 300);
            this.addChild(clearButton);
            clearButton.onTouchUp(function() {
                self.instructionTicker.clearInstructions();
                self.splashNode.reset();
            })

            this.notFollowingGrey = [stopButton, pauseButton];
        },

        enableAfterPlacing:function() {
            for (var i = 0; i < this.instructionContainer.buttons.length; i++) {
                this.instructionContainer.buttons[i].setEnabled(true);
            };
        },

        update:function() {
            this._super();
            if (this.following !== this.splashNode.arrow.following) {
                this.following = this.splashNode.arrow.following;
                for (var i = 0; i < this.notFollowingGrey.length; i++) {
                    this.notFollowingGrey[i].setGreyedOut(!this.following);
                };
                this.instructionTicker.setPlaying(this.following);
                this.splashNode.setPlaying(this.following);
            };
            if (this.placed !== this.splashNode.placed) {
                this.enableAfterPlacing();
                this.instructionTicker.processPlaced();
            };
        },
    });

    ToolLayer.create = function () {
        var sg = new ToolLayer();
        if (sg && sg.init(cc.c4b(255, 255, 255, 255))) {
            return sg;
        }
        return null;
    };

    ToolLayer.scene = function () {
        var scene = cc.Scene.create();
        var layer = ToolLayer.create();
        scene.addChild(layer);

        scene.layer=layer;

        scene.ql = new QLayer();
        scene.ql.init();
        layer.addChild(scene.ql, 99);

        scene.update = function(dt) {
            this.layer.update(dt);
            this.ql.update(dt);
        };
        scene.scheduleUpdate();


        return scene;
    };

    exports.ToolLayer = Tool;

});
