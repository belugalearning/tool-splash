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

            this.playButton = new BLButton();
            this.playButton.initWithFile(window.bl.getResource('play_button'));
            this.playButton.setPosition(this._windowSize.width - this.playButton.getContentSize().width/2, 700);
            this.addChild(this.playButton);

            var self = this;
            this.playButton.onTouchUp(function() {
                if (self.instructionTicker.valid) {
                    self.splashNode.reset();
                    var arrow = self.splashNode.arrow;
                    arrow.speed = speedLabel.speed;
                    var instructions = self.instructionTicker.instructions;
                    arrow.followInstructions(instructions);
                    // arrow.freakOut();
                } else {
                    self.instructionTicker.showInvalidBrackets();
                };
            });

            var speedLabel = new cc.LabelTTF.create("", "mikadoBold", 20);
            speedLabel.setPosition(970, 580);
            this.addChild(speedLabel);
            speedLabel.speed = 1;
            speedLabel.setString(speedLabel.speed);

            this.speedUp = new BLButton();
            this.speedUp.initWithFile(window.bl.getResource('up_button'));
            this.speedUp.setPosition(970, 620);
            this.addChild(this.speedUp);
            this.speedUp.onTouchUp(function() {
                if (speedLabel.speed < 10) {
                    speedLabel.speed++;
                    speedLabel.setString(speedLabel.speed);
                };
            });

            this.speedDown = new BLButton();
            this.speedDown.initWithFile(window.bl.getResource('down_button'));
            this.speedDown.setPosition(970, 520);
            this.addChild(this.speedDown);
            this.speedDown.onTouchUp(function() {
                if (speedLabel.speed > 1) {
                    speedLabel.speed--;
                    speedLabel.setString(speedLabel.speed);
                };
            });

            this.stopButton = new BLButton();
            this.stopButton.initWithFile(window.bl.getResource('free_form_closebutton'));
            this.stopButton.setPosition(970, 450);
            this.addChild(this.stopButton);
            this.stopButton.onTouchUp(function() {
                self.splashNode.arrow.breakMovement = true;
            });

            this.clearButton = new BLButton();
            this.clearButton.initWithFile(window.bl.getResource('clear_button'));
            this.clearButton.setPosition(970, 400);
            this.addChild(this.clearButton);
            this.clearButton.onTouchUp(function() {
                self.instructionTicker.clearInstructions();
                self.splashNode.reset();
            })
        },

        setupInstructionButtons:function() {
            var self = this;
            var defaultButtonZOrder = 1;
            _.each(InstructionTypes, function(type) {
                if (type["include_in_container"]) {
                    var instructionButton = new InstructionDragButton()
                    instructionButton.initWithType(type);
                    var positionInContainer = self.instructionContainer.getPositionForInstruction(type);
                    var positionInWorld = self.instructionContainer.convertToWorldSpace(positionInContainer);
                    instructionButton.setPosition(positionInWorld);
                    instructionButton.setZOrder(defaultButtonZOrder);
                    self.addChild(instructionButton);

                    self.setInstructionTouchFunctions(instructionButton);
                };
            })
        },

        setInstructionTouchFunctions:function(button) {
            var self = this;

            var highlighting = false;

            button.onTouchDown(function() {
                this.setVisible(true);
                self.reorderChild(button, foregroundZOrder);
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
                if (self.instructionTicker.touched(touchLocation)) {
                    var touchRelative = self.instructionTicker.convertToNodeSpace(touchLocation);
                    this.removeFromParent();
                    if (this.type === InstructionTypes.LOOP) {
                        var openBracket = new InstructionDraggable();
                        openBracket.initWithType(InstructionTypes.OPEN_BRACKET);
                        var closeBracket = new InstructionDraggable();
                        closeBracket.initWithType(InstructionTypes.CLOSE_BRACKET);
                        self.instructionTicker.dropInInstructionBoxes([openBracket, closeBracket], touchRelative);
                        openBracket.linked = [closeBracket];
                        closeBracket.linked = [openBracket];
                    } else {
                        self.instructionTicker.dropInInstructionBoxes([this], touchRelative);
                        this.linked = [];
                    };
                    button.setupDraggable();
                    self.setInstructionTouchFunctions(button);
                } else {
                    this.setVisible(false);
                    this.returnToLastPosition();
                };
                if (highlighting) {
                    self.instructionTicker.clearHighlight();
                    highlighting = false;
                };
            });
        },

        update:function() {
            this._super();
            if (this.following !== this.splashNode.arrow.following) {
                this.following = this.splashNode.arrow.following;
                this.playButton.setGreyedOut(this.following);
                this.speedUp.setGreyedOut(this.following);
                this.speedDown.setGreyedOut(this.following);
                this.stopButton.setGreyedOut(!this.following);
                this.clearButton.setGreyedOut(this.following);
                this.instructionTicker.showPlayingDisplay(this.following);
                this.instructionTicker.setInstructionsDraggable(!this.following);
                if (!this.following) {
                    this.instructionTicker.unhighlightAll();
                };
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
